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
    bkash_username: process.env.BKASH_USERNAME!,
bkash_password: process.env.BKASH_PASSWORD!,
bkash_app_key: process.env.BKASH_APP_KEY!,
bkash_app_secret: process.env.BKASH_APP_SECRET!,
bkash_base_url: process.env.BKASH_BASE_URL!,
backend_url: process.env.BKASH_BACKEND_URI!,
bkash_agreement_id: process.env.BKASH_AGREEMENT_ID!,
bkash_callback_url: process.env.BKASH_CALLBACK_URL!
};

export default config;