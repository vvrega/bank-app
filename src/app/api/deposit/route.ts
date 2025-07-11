import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.login) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { amount, currency } = await req.json();
  const numericAmount = Math.round(Number(amount) * 100) / 100;

  if (!numericAmount || !currency) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  if (numericAmount > 100000) {
    return NextResponse.json(
      { error: 'Maximum deposit is 100000' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { login: session.user.login },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const account = await prisma.account.findFirst({
    where: { userId: user.id, currency },
  });

  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.account.update({
      where: { id: account.id },
      data: { balance: { increment: numericAmount } },
    }),
    prisma.transaction.create({
      data: {
        toAccountId: account.id,
        amount: numericAmount,
        currency,
        type: 'Deposit',
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
