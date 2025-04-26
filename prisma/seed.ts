import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create base cryptocurrencies
  const btc = await prisma.cryptocurrency.upsert({
    where: { symbol: 'BTC' },
    update: {},
    create: {
      symbol: 'BTC',
      name: 'Bitcoin',
      logo: '/images/crypto/btc.svg',
      decimals: 8,
    },
  });

  const eth = await prisma.cryptocurrency.upsert({
    where: { symbol: 'ETH' },
    update: {},
    create: {
      symbol: 'ETH',
      name: 'Ethereum',
      logo: '/images/crypto/eth.svg',
      decimals: 18,
    },
  });

  const usdt = await prisma.cryptocurrency.upsert({
    where: { symbol: 'USDT' },
    update: {},
    create: {
      symbol: 'USDT',
      name: 'Tether',
      logo: '/images/crypto/usdt.svg',
      decimals: 6,
    },
  });

  // Create trading pairs
  await prisma.tradingPair.upsert({
    where: { name: 'BTC/USDT' },
    update: {},
    create: {
      name: 'BTC/USDT',
      baseCurrencyId: btc.id,
      quoteCurrencyId: usdt.id,
      minOrderSize: '0.0001',
      maxOrderSize: '100',
      priceDecimals: 2,
      quantityDecimals: 8,
      tradingFee: '0.001',
    },
  });

  await prisma.tradingPair.upsert({
    where: { name: 'ETH/USDT' },
    update: {},
    create: {
      name: 'ETH/USDT',
      baseCurrencyId: eth.id,
      quoteCurrencyId: usdt.id,
      minOrderSize: '0.001',
      maxOrderSize: '1000',
      priceDecimals: 2,
      quantityDecimals: 8,
      tradingFee: '0.001',
    },
  });

  await prisma.tradingPair.upsert({
    where: { name: 'ETH/BTC' },
    update: {},
    create: {
      name: 'ETH/BTC',
      baseCurrencyId: eth.id,
      quoteCurrencyId: btc.id,
      minOrderSize: '0.001',
      maxOrderSize: '1000',
      priceDecimals: 8,
      quantityDecimals: 8,
      tradingFee: '0.001',
    },
  });

  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: '$2a$10$GIs9YTUBiyoGTpvO7u/9lOJmB5t3IOUj3dm9bWv1URoRT38svAVAW', // "password" - use proper bcrypt hash in production
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  });

  // Create default settings
  await prisma.setting.upsert({
    where: { key: 'exchange_name' },
    update: {},
    create: {
      key: 'exchange_name',
      value: 'CryptoExchange',
      category: 'general',
      isPublic: true,
    },
  });

  await prisma.setting.upsert({
    where: { key: 'maintenance_mode' },
    update: {},
    create: {
      key: 'maintenance_mode',
      value: 'false',
      category: 'system',
      isPublic: true,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });