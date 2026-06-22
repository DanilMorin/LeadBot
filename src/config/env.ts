import dotenv from 'dotenv';

dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }

  return value;
}

export const env = {
  botToken: getEnv('BOT_TOKEN'),
  adminChatId: getEnv('ADMIN_CHAT_ID'),
  apiPort: Number(process.env.API_PORT || 3000),
  databaseUrl: getEnv('DATABASE_URL'),
  shadowDatabaseUrl: getEnv('SHADOW_DATABASE_URL'),
};