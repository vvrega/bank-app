const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax',
    },
  })
);

app.post('/api/register', async (req, res) => {
  const { login, email, password, firstName, lastName } = req.body;
  if (!login || !email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const existing = await prisma.user.findFirst({
    where: { OR: [{ login }, { email }] },
  });
  if (existing) {
    return res.status(409).json({ error: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const baseIban = '6722403317000077775739';
  let iban = '';

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

  iban = `${baseIban}${user.id.toString().padStart(4, '0')}`;

  await prisma.user.update({
    where: { id: user.id },
    data: { iban },
  });

  res.json({ success: true });
});

app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  const user = await prisma.user.findUnique({ where: { login } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  req.session.userId = user.id;
  res.json({ success: true, userId: user.id });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

app.get('/api/me', async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ error: 'Not authenticated' });
  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
  });
  res.json({ user });
});

app.post('/api/change-password', async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ error: 'Not authenticated' });
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: 'Missing fields' });

  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid)
    return res.status(401).json({ error: 'Current password is incorrect' });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  res.json({ success: true });
});

// Get user contacts
app.get('/api/contacts', async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ error: 'Not authenticated' });
  const contacts = await prisma.contact.findMany({
    where: { ownerId: req.session.userId },
    include: { contactUser: true },
  });
  res.json({
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
});

// Add new contact
app.post('/api/contacts', async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ error: 'Not authenticated' });
  const { name, iban } = req.body;
  if (!name || !iban)
    return res.status(400).json({ error: 'Name and IBAN are required' });

  const user = await prisma.user.findUnique({ where: { iban } });
  if (!user) return res.status(404).json({ error: 'No user with this IBAN' });

  // Check if contact already exists
  const exists = await prisma.contact.findFirst({
    where: {
      ownerId: req.session.userId,
      contactUserId: user.id,
    },
  });
  if (exists) return res.status(409).json({ error: 'Contact already exists' });

  await prisma.contact.create({
    data: {
      ownerId: req.session.userId,
      contactUserId: user.id,
      contactUserIban: iban,
      name,
    },
  });

  res.json({ success: true });
});

// Get user accounts
app.get('/api/accounts', async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ error: 'Not authenticated' });
  const accounts = await prisma.account.findMany({
    where: { userId: req.session.userId },
    select: { id: true, currency: true, balance: true },
  });
  res.json({ accounts });
});

app.post('/api/accounts/deposit', async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ error: 'Not authenticated' });
  const { amount, currency } = req.body;
  if (!amount || !currency)
    return res.status(400).json({ error: 'Missing data' });
  if (amount > 100000)
    return res.status(400).json({ error: 'Maximum deposit is 100000' });

  const account = await prisma.account.findFirst({
    where: { userId: req.session.userId, currency },
  });
  if (!account) return res.status(404).json({ error: 'Account not found' });

  await prisma.account.update({
    where: { id: account.id },
    data: { balance: { increment: amount } },
  });

  res.json({ success: true });
});

app.post('/api/accounts/withdraw', async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ error: 'Not authenticated' });
  const { amount, currency } = req.body;
  if (!amount || !currency)
    return res.status(400).json({ error: 'Missing data' });

  const account = await prisma.account.findFirst({
    where: { userId: req.session.userId, currency },
  });
  if (!account) return res.status(404).json({ error: 'Account not found' });
  if (amount > account.balance)
    return res.status(400).json({ error: 'Insufficient funds' });

  await prisma.account.update({
    where: { id: account.id },
    data: { balance: { decrement: amount } },
  });

  res.json({ success: true });
});

app.listen(4000, () => console.log('Backend running on http://localhost:4000'));
