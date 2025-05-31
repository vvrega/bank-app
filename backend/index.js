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

app.listen(4000, () => console.log('Backend running on http://localhost:4000'));
