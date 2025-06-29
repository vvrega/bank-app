import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { fromCurrency, toCurrency, amount } = await req.json();

    if (!fromCurrency || !toCurrency || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (fromCurrency === toCurrency) {
      return NextResponse.json(
        { error: 'Cannot exchange to the same currency' },
        { status: 400 }
      );
    }

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const userId = parseInt(session.user.id);
    const fromAccount = await prisma.account.findFirst({
      where: { userId, currency: fromCurrency },
    });

    const toAccount = await prisma.account.findFirst({
      where: { userId, currency: toCurrency },
    });

    if (!fromAccount || !toAccount) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    if (Number(fromAccount.balance) < numericAmount) {
      return NextResponse.json(
        { error: 'Insufficient funds' },
        { status: 400 }
      );
    }

    const ratesResponse = await fetch(
      `${process.env.NEXTAUTH_URL}/api/exchangeRates`
    );
    if (!ratesResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch exchange rates' },
        { status: 500 }
      );
    }

    const ratesData = await ratesResponse.json();
    const rates = ratesData.quotes;

    let exchangeRate;
    if (fromCurrency === 'PLN') {
      exchangeRate = rates[`PLN${toCurrency}`];
    } else if (toCurrency === 'PLN') {
      exchangeRate = 1 / rates[`PLN${fromCurrency}`];
    } else {
      // Cross rate calculation (non-PLN to non-PLN)
      const fromRate = rates[`PLN${fromCurrency}`];
      const toRate = rates[`PLN${toCurrency}`];
      exchangeRate = toRate / fromRate;
    }

    const targetAmount = numericAmount * exchangeRate;
    const roundedTargetAmount = Math.round(targetAmount * 100) / 100;

    await prisma.$transaction([
      prisma.account.update({
        where: { id: fromAccount.id },
        data: { balance: { decrement: numericAmount } },
      }),

      prisma.account.update({
        where: { id: toAccount.id },
        data: { balance: { increment: roundedTargetAmount } },
      }),
      prisma.transaction.create({
        data: {
          fromAccountId: fromAccount.id,
          toAccountId: toAccount.id,
          amount: -numericAmount,
          currency: fromCurrency,
          type: 'Exchange',
          description: `Exchanged ${numericAmount} ${fromCurrency} to ${roundedTargetAmount.toFixed(
            2
          )} ${toCurrency}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      exchangeRate,
      fromAmount: numericAmount,
      toAmount: roundedTargetAmount,
    });
  } catch (error) {
    console.error('Exchange error:', error);
    return NextResponse.json({ error: 'Exchange failed' }, { status: 500 });
  }
}
