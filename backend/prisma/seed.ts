import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password.util';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Mercedes city
  const mercedes = await prisma.city.upsert({
    where: { name: 'Mercedes' },
    update: {},
    create: {
      name: 'Mercedes',
      province: 'Buenos Aires',
      country: 'Argentina',
      latitude: -34.6516,
      longitude: -59.4308,
      active: true,
    },
  });

  console.log('✅ City created: Mercedes, Buenos Aires');

  // Create test user (Cliente)
  const hashedPassword = await hashPassword('Test1234');

  await prisma.user.upsert({
    where: { email: 'cliente@test.com' },
    update: {},
    create: {
      email: 'cliente@test.com',
      passwordHash: hashedPassword,
      firstName: 'Juan',
      lastName: 'Pérez',
      role: 'CUSTOMER',
      cityId: mercedes.id,
      emailVerified: true,
    },
  });

  console.log('✅ Test user created: cliente@test.com');

  // Create test business user
  const testBusinessUser = await prisma.user.upsert({
    where: { email: 'negocio@test.com' },
    update: {},
    create: {
      email: 'negocio@test.com',
      passwordHash: hashedPassword,
      firstName: 'María',
      lastName: 'González',
      phone: '+5492324123456',
      role: 'BUSINESS',
      cityId: mercedes.id,
      emailVerified: true,
    },
  });

  // Create business
  const testBusiness = await prisma.business.upsert({
    where: { userId: testBusinessUser.id },
    update: {},
    create: {
      userId: testBusinessUser.id,
      name: 'Panadería Don Juan',
      slug: 'panaderia-don-juan',
      category: 'Alimentos y Bebidas',
      description: 'Panadería artesanal con más de 20 años de experiencia en Mercedes',
      phone: '+5492324123456',
      address: 'Av. Libertador 123, Mercedes, Buenos Aires',
      latitude: -34.6516,
      longitude: -59.4308,
      verified: true,
      subscriptionPlan: 'FREE',
    },
  });

  console.log('✅ Test business created: Panadería Don Juan');

  // Create test products
  await prisma.product.createMany({
    data: [
      {
        userId: testBusinessUser.id,
        businessId: testBusiness.id,
        name: 'Pan de Campo',
        description: 'Pan artesanal recién horneado todas las mañanas',
        category: 'Panadería',
        price: 500,
        cityId: mercedes.id,
        images: [],
        status: 'ACTIVE',
      },
      {
        userId: testBusinessUser.id,
        businessId: testBusiness.id,
        name: 'Facturas Surtidas (x6)',
        description: 'Medialunas, cruasanes y facturas variadas',
        category: 'Panadería',
        price: 1200,
        cityId: mercedes.id,
        images: [],
        status: 'ACTIVE',
      },
    ],
  });

  console.log('✅ Test products created');

  // Create test service provider
  const serviceUser = await prisma.user.upsert({
    where: { email: 'servicios@test.com' },
    update: {},
    create: {
      email: 'servicios@test.com',
      passwordHash: hashedPassword,
      firstName: 'Carlos',
      lastName: 'Ramírez',
      phone: '+5492324234567',
      role: 'SERVICE_PROVIDER',
      cityId: mercedes.id,
      emailVerified: true,
    },
  });

  const serviceBusiness = await prisma.business.upsert({
    where: { userId: serviceUser.id },
    update: {},
    create: {
      userId: serviceUser.id,
      name: 'Plomería Ramírez',
      slug: 'plomeria-ramirez',
      category: 'Servicios Profesionales',
      description: 'Plomería general, reparaciones y instalaciones',
      phone: '+5492324234567',
      coverageArea: 'Toda Mercedes',
      verified: true,
      subscriptionPlan: 'FREE',
    },
  });

  await prisma.service.create({
    data: {
      userId: serviceUser.id,
      businessId: serviceBusiness.id,
      name: 'Reparación de goteras',
      description: 'Reparación rápida y efectiva de todo tipo de goteras',
      category: 'Plomería',
      priceType: 'fixed',
      price: 5000,
      priceUnit: 'servicio',
      cityId: mercedes.id,
      images: [],
      status: 'ACTIVE',
    },
  });

  console.log('✅ Test service provider and service created');

  console.log('🎉 Database seeding completed!');
  console.log('\n📝 Test credentials:');
  console.log('   Cliente: cliente@test.com / Test1234');
  console.log('   Negocio: negocio@test.com / Test1234');
  console.log('   Servicios: servicios@test.com / Test1234');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
