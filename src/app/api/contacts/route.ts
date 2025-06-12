import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.login) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { login: session.user.login },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const contacts = await prisma.contact.findMany({
    where: { ownerId: user.id },
    include: { contactUser: true },
  });

  return NextResponse.json({
    contacts: contacts.map((c) => ({
      id: c.id,
      name: c.name,
      contactUserIban: c.contactUserIban,
      contactUserId: c.contactUserId,
      contactUser: c.contactUser
        ? {
            firstName: c.contactUser.firstName,
            lastName: c.contactUser.lastName,
          }
        : undefined,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.login) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, iban } = await req.json();
  if (!name || !iban) {
    return NextResponse.json(
      { error: 'Name and IBAN are required' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { login: session.user.login },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const recipientUser = await prisma.user.findUnique({
    where: { iban },
  });

  if (!recipientUser) {
    return NextResponse.json(
      { error: 'No user with this IBAN' },
      { status: 404 }
    );
  }

  const exists = await prisma.contact.findFirst({
    where: {
      ownerId: user.id,
      contactUserId: recipientUser.id,
    },
  });

  if (exists) {
    return NextResponse.json(
      { error: 'Contact already exists' },
      { status: 409 }
    );
  }

  await prisma.contact.create({
    data: {
      ownerId: user.id,
      contactUserId: recipientUser.id,
      contactUserIban: iban,
      name,
    },
  });

  return NextResponse.json({ success: true });
}
