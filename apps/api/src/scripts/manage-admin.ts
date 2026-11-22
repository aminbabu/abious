import { auth } from '../auth.js';
import { pool } from '../db/index.js';

interface AdminOptions {
  email: string;
  password?: string;
  name?: string;
  resetAllUsers?: boolean;
}

function parseArgs(): AdminOptions {
  const args = process.argv.slice(2);
  const options: AdminOptions = {
    email: '',
    password: '',
    name: 'Admin',
    resetAllUsers: false,
  };

  for (const arg of args) {
    if (arg === '--reset-users' || arg === '--reset-all') {
      options.resetAllUsers = true;
    } else if (arg.startsWith('--email=')) {
      options.email = arg.split('=')[1]?.trim() || '';
    } else if (arg.startsWith('--password=')) {
      options.password = arg.split('=')[1]?.trim() || '';
    } else if (arg.startsWith('--name=')) {
      options.name = arg.split('=')[1]?.trim() || 'Admin';
    }
  }

  return options;
}

export async function manageAdmin() {
  const options = parseArgs();

  console.log('⚡ Admin Setup Script Starting...');

  if (options.resetAllUsers) {
    console.log('🗑️  Deleting all existing users, sessions, and accounts...');
    // Foreign keys to session and account have ON DELETE CASCADE
    await pool.query('DELETE FROM "user";');
    await pool.query('DELETE FROM "verification";');
    console.log('✅ All existing users and sessions removed.');
  }

  if (!options.email) {
    if (options.resetAllUsers) {
      console.log('ℹ️  No --email provided. Finished clearing users.');
      return;
    }
    console.error('❌ Error: --email=<email> is required.');
    console.log('Usage: node dist/scripts/manage-admin.js --email=admin@example.com --password=Secret123! [--reset-users]');
    process.exit(1);
  }

  if (!options.password) {
    console.error('❌ Error: --password=<password> is required.');
    console.log('Usage: node dist/scripts/manage-admin.js --email=admin@example.com --password=Secret123! [--reset-users]');
    process.exit(1);
  }

  // If user already exists, remove that user so we can cleanly register fresh credentials with Better Auth
  const checkRes = await pool.query('SELECT id FROM "user" WHERE email = $1;', [options.email]);
  if (checkRes.rows.length > 0) {
    console.log(`ℹ️  User '${options.email}' already exists. Deleting prior record to recreate cleanly...`);
    await pool.query('DELETE FROM "user" WHERE email = $1;', [options.email]);
  }
    console.log(`👤 Creating new admin account for '${options.email}'...`);
    const signupRes = await auth.api.signUpEmail({
      body: {
        email: options.email,
        password: options.password,
        name: options.name || 'Admin',
      },
    });

    if (!signupRes || !signupRes.user) {
      throw new Error('Failed to create user via Better Auth');
    }

    await pool.query('UPDATE "user" SET role = $1, "emailVerified" = true, "updatedAt" = NOW() WHERE id = $2;', [
      'admin',
      signupRes.user.id,
    ]);

    console.log(`🎉 New Admin created successfully!`);
    console.log(`   - ID: ${signupRes.user.id}`);
    console.log(`   - Email: ${options.email}`);
    console.log(`   - Role: admin`);
  }

if (process.argv[1]?.includes('manage-admin')) {
  manageAdmin()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('❌ Error running manage-admin:', err);
      await pool.end();
      process.exit(1);
    });
}
