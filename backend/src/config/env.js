const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredVars = [
  'DATABASE_URL',
  'JWT_SECRET',
];

const optionalVars = {
  PORT: '3001',
  JWT_EXPIRES_IN: '7d',
  GOOGLE_MAPS_API_KEY: '',
  CLOUDINARY_CLOUD_NAME: '',
  CLOUDINARY_API_KEY: '',
  CLOUDINARY_API_SECRET: '',
  CORS_ORIGIN: 'http://localhost:5173',
};

function validateEnv() {
  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file against .env.example'
    );
  }
}

validateEnv();

const env = {
  port: parseInt(process.env.PORT || optionalVars.PORT, 10),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || optionalVars.JWT_EXPIRES_IN,
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || optionalVars.GOOGLE_MAPS_API_KEY,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || optionalVars.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY || optionalVars.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET || optionalVars.CLOUDINARY_API_SECRET,
  },
  corsOrigin: process.env.CORS_ORIGIN || optionalVars.CORS_ORIGIN,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
};

module.exports = env;
