import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { login, password, email, firstName, lastName } = await req.json();
  if (!login || !password || !email) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { login } });
  if (existing) {
    return NextResponse.json({ error: 'User exists' }, { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);

  const tempIban = '';

  const user = await prisma.user.create({
    data: {
      login,
      password: hashed,
      email,
      firstName,
      lastName,
      iban: tempIban,
    },
  });

  const iban = '6722403317000077775739' + user.id.toString().padStart(4, '0');

  await prisma.user.update({
    where: { id: user.id },
    data: { iban },
  });

  await prisma.account.createMany({
    data: [
      { userId: user.id, currency: 'PLN', balance: 0 },
      { userId: user.id, currency: 'USD', balance: 0 },
      { userId: user.id, currency: 'EUR', balance: 0 },
      { userId: user.id, currency: 'GBP', balance: 0 },
    ],
  });

  return NextResponse.json({ id: user.id, login: user.login, iban });
}
