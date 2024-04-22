import { PrismaClient } from '@prisma/client';
import { Access } from '../../src/auth/access.enum';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const seedUser = async (reset: boolean = false) => {
  if (reset) {
    prisma.role.deleteMany();
    prisma.user.deleteMany();
  }

  const roles = [
    {
      name: 'superadmin',
      label: 'Super Administrator',
      accesses: Object.values(Access),
      createdBy: 1,
    },
    {
      name: 'admin',
      label: 'Administrator',
      accesses: [Access.dashboard_view, Access.company_create],
      createdBy: 1,
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      create: { ...role },
      update: { ...role },
    });
  }

  const password = await bcrypt.hash('123456', 10);
  const users = [
    {
      username: 'superadmin',
      email: 'superadmin@gmail.com',
      name: 'Admin Super',
      createdBy: 1,
      roleId: (await prisma.role.findUnique({ where: { name: 'superadmin' } }))
        .id,
      password,
    },
    {
      username: 'admin',
      email: 'admin@gmail.com',
      name: 'Admin Biasa',
      createdBy: 1,
      roleId: (await prisma.role.findUnique({ where: { name: 'admin' } })).id,
      password,
    },
  ];

  for (const user of users) {
    const userData = await prisma.user.upsert({
      where: { username: user.username },
      create: {
        ...user,
        createdBy: 1,
      },
      update: { ...user },
    });
  }
};

const params = {
  reset: false,
  seedUser: false,
};

const args = process.argv;
args.forEach(async (key) => {
  switch (key) {
    case '--a':
    case '-A':
      params.seedUser = true;

      break;
    case '--menu':

    case '--user':
    case '-U':
      params.seedUser = true;
      break;

    case '--reset':
    case '-R':
      params.reset = true;
      break;

    default:
      break;
  }
});

async function main() {
  if (params.seedUser) await seedUser(params.reset);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e.message);
    await prisma.$disconnect();
    process.exit(1);
  });
