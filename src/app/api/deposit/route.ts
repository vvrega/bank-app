import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.login) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { accountId, amount } = await req.json();
  if (!accountId || !amount) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const account = await prisma.account.update({
    where: { id: accountId },
    data: { balance: { increment: amount } },
  });
  return NextResponse.json(account);
}
