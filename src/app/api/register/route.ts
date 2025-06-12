import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { login, email, password, firstName, lastName } = await req.json();

  if (!login || !email || !password || !firstName || !lastName) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ login }, { email }] },
  });

  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const baseIban = '6722403317000077775739';

  // First create user with empty IBAN
  const user = await prisma.user.create({
    data: {
      login,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      iban: '',
      accounts: {
        create: [
          { currency: 'PLN', balance: 0 },
          { currency: 'USD', balance: 0 },
          { currency: 'EUR', balance: 0 },
          { currency: 'GBP', balance: 0 },
        ],
      },
    },
  });

  // Update user with proper IBAN that includes user ID
  const iban = `${baseIban}${user.id.toString().padStart(4, '0')}`;
  await prisma.user.update({
    where: { id: user.id },
    data: { iban },
  });

  return NextResponse.json({
    success: true,
    id: user.id,
    login: user.login,
    iban,
  });
}
