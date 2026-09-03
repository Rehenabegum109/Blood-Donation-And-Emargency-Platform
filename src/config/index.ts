import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 5000,

  database_url: process.env.DATABASE_URL,


redis_user:process.env.REDIS_USER!,
redis_password:process.env.REDIS_PASSWORD!,
redis_host:process.env.REDIS_HOST!,
redis_port:process.env.REDIS_PORT!,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,

  smtp_host: process.env.SMTP_HOST!,
  smtp_port: process.env.SMTP_PORT!,
  smtp_user: process.env.SMTP_USER!,
  smtp_password: process.env.SMTP_PASSWORD!,
  email_sender: process.env.SMTP_SENDER!,
};

export default config;