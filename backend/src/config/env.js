import dotenv from 'dotenv';
dotenv.config();

const required = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
for (const k of required) {
  if (!process.env[k]) {
    console.error(`[env] missing ${k} in .env`);
  }
}

export const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  adminOrigin: process.env.ADMIN_ORIGIN || 'http://localhost:3001',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sodiq_school',
  },
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  seed: {
    adminEmail: process.env.SEED_ADMIN_EMAIL || 'developer@gmail.com',
    adminPassword: process.env.SEED_ADMIN_PASSWORD || 'developer$123',
    adminName: process.env.SEED_ADMIN_NAME || 'Developer',
  },
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  publicBaseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:4000',
  locales: ['uz', 'ru', 'en'],
  defaultLocale: 'uz',
};
