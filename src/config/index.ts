import dotenvConfig from './dotenv.config';

dotenvConfig();

export default {
  PORT: process.env.PORT || 3000,
  DB_URI: process.env.DB_URI || 'mongodb://localhost/devapi-db',
  SALT_KEY: process.env.SALT_KEY || 'secret-key'
};
