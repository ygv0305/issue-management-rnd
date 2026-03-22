// Node modules
import dotenv from 'dotenv';

dotenv.config();

const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ADMIN_MAIL: process.env.ADMIN_MAIL,
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export default config;
