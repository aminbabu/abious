import { eq } from 'drizzle-orm';
import { auth } from '../auth.js';
import { users } from '../packages/auth/entities/auth.entity.js';
import { sqlite, db } from './index.js';

export async function seedAdminUser() {
  const email = (process.env.ADMIN_EMAIL || 'amin.babu.bd@gmail.com').trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  const name = (process.env.ADMIN_NAME || 'Amin Babu').trim();

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing.length > 0) {
    if (existing[0].role !== 'admin' || !existing[0].emailVerified) {
      await db
        .update(users)
        .set({ role: 'admin', emailVerified: true, updatedAt: new Date() })
        .where(eq(users.id, existing[0].id));
    }
    console.log(`ℹ️  Admin user already exists (${email}).`);
    return;
  }

  if (!password) {
    console.log('ℹ️  ADMIN_PASSWORD not set — skipping admin user creation.');
    return;
  }

  const res = await auth.api.signUpEmail({
    body: { email, password, name },
  });

  if (res?.user?.id) {
    await db
      .update(users)
      .set({ role: 'admin', emailVerified: true, updatedAt: new Date() })
      .where(eq(users.id, res.user.id));
    console.log(`✅ Admin user seeded (${email}).`);
  }
}

export async function seedDatabase() {
  console.log('🌱 Starting database seed...');
  await seedAdminUser();
  console.log('✅ Database seeding finished successfully.');
}

if (process.argv.includes('--run')) {
  seedDatabase()
    .then(() => {
      sqlite.close();
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Seeder failed:', err);
      sqlite.close();
      process.exit(1);
    });
}
