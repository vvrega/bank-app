import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.login) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const contactUserId = url.searchParams.get('contactUserId');
  const contactUserIdNumber = contactUserId
    ? parseInt(contactUserId, 10)
    : null;

  const user = await prisma.user.findUnique({
    where: { login: session.user.login },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const userAccounts = await prisma.account.findMany({
    where: { userId: user.id },
    select: { id: true, userId: true },
  });
  const userAccountIds = userAccounts.map((a) => a.id);

  let transactions = [];

  if (contactUserIdNumber) {
    // Get contact user accounts
    const contactAccounts = await prisma.account.findMany({
      where: { userId: contactUserIdNumber },
      select: { id: true, userId: true },
    });
    const contactAccountIds = contactAccounts.map((a) => a.id);

    // Transactions between user and contact
    transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          {
            fromAccountId: { in: userAccountIds },
            toAccountId: { in: contactAccountIds },
          },
          {
            fromAccountId: { in: contactAccountIds },
            toAccountId: { in: userAccountIds },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        fromAccount: { include: { user: true } },
        toAccount: { include: { user: true } },
      },
    });
  } else {
    // Get all transactions for user accounts
    transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { fromAccountId: { in: userAccountIds } },
          { toAccountId: { in: userAccountIds } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        fromAccount: { include: { user: true } },
        toAccount: { include: { user: true } },
      },
    });
  }

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const mapped = transactions.map((t) => ({
    id: t.id,
    type: t.type,
    amount: t.amount,
    currency: t.currency,
    date: formatDate(t.createdAt),
    description: t.description,
    fromAccountId: t.fromAccountId,
    toAccountId: t.toAccountId,
    fromUserName: t.fromAccount?.user
      ? `${t.fromAccount.user.firstName} ${t.fromAccount.user.lastName}`
      : undefined,
    toUserName: t.toAccount?.user
      ? `${t.toAccount.user.firstName} ${t.toAccount.user.lastName}`
      : undefined,
    fromAccountUserId: t.fromAccount?.userId,
    toAccountUserId: t.toAccount?.userId,
  }));

  return NextResponse.json({ transactions: mapped });
}
