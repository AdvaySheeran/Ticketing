import { PrismaClient, Role, Priority, Status } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter })

async function seedData() {
  const hashed = await bcrypt.hash('password123', 10);

  const usersData = [
    { email: 'admin@test.com', name: 'Admin User', role: Role.ADMIN },
    { email: 'agent@test.com', name: 'Agent User', role: Role.AGENT },
    { email: 'customer@test.com', name: 'Customer User', role: Role.CUSTOMER },
  ];

  const users = await Promise.all(
    usersData.map(u =>
      prisma.user.upsert({
        where: { email: u.email },
        update: { role: u.role },
        create: { ...u, password: hashed },
      })
    )
  );

  const [, agent, customer] = users;

  const ticketsData = [
    {
      id: 1,
      subject: 'Login page is broken',
      description: 'Cannot login with correct credentials on the new portal',
      priority: Priority.HIGH,
      status: Status.OPEN,
      createdById: customer.id,
      assignedToId: agent.id,
    },
    {
      id: 2,
      subject: 'Dashboard not loading',
      description: 'Dashboard shows blank screen after login',
      priority: Priority.MEDIUM,
      status: Status.IN_PROGRESS,
      createdById: customer.id,
      assignedToId: agent.id,
    },
    {
      id: 3,
      subject: 'Export to CSV not working',
      description: 'CSV export button does nothing when clicked',
      priority: Priority.LOW,
      status: Status.CLOSED,
      createdById: customer.id,
    },
  ];

  await Promise.all(
    ticketsData.map(t =>
      prisma.ticket.upsert({
        where: { id: t.id },
        update: {},
        create: t,
      })
    )
  );

  console.log('Seeded successfully');
  users.forEach((u: typeof users[0]) => console.log(`${u.role}: ${u.email}`));
}

seedData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });