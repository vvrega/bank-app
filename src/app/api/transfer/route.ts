import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.login) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { fromCurrency, amount, iban, title, name } = await req.json();
  const numericAmount = Math.round(Number(amount) * 100) / 100;

  if (!fromCurrency || !numericAmount || !iban || !title || !name) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const sender = await prisma.user.findUnique({
    where: { login: session.user.login },
  });

  if (!sender) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const fromAccount = await prisma.account.findFirst({
    where: { userId: sender.id, currency: fromCurrency },
  });

  if (!fromAccount) {
    return NextResponse.json(
      { error: 'Your account not found' },
      { status: 404 }
    );
  }

  if (numericAmount > Number(fromAccount.balance)) {
    return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
  }

  const recipient = await prisma.user.findUnique({
    where: { iban },
  });

  if (!recipient) {
    return NextResponse.json(
      { error: 'Recipient IBAN not found' },
      { status: 404 }
    );
  }

  if (sender.iban === iban) {
    return NextResponse.json(
      { error: 'Cannot transfer to your own account' },
      { status: 400 }
    );
  }

  const toAccount = await prisma.account.findFirst({
    where: { userId: recipient.id, currency: fromCurrency },
  });

  if (!toAccount) {
    return NextResponse.json(
      {
        error: 'Recipient does not have account in this currency',
      },
      { status: 404 }
    );
  }

  await prisma.$transaction([
    prisma.account.update({
      where: { id: fromAccount.id },
      data: { balance: { decrement: numericAmount } },
    }),
    prisma.account.update({
      where: { id: toAccount.id },
      data: { balance: { increment: numericAmount } },
    }),
    prisma.transaction.create({
      data: {
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        amount: numericAmount,
        currency: fromCurrency,
        description: title,
        type: 'Transfer',
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
