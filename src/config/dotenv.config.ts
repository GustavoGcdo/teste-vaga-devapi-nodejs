import dotenv from 'dotenv';

const dotenvConfig = (): void => {
  const { NODE_ENV } = process.env;

  switch (NODE_ENV) {
    case 'dev':
      dotenv.config({ path: '.env.dev' });
      break;

    case 'test':
      dotenv.config({ path: '.env.test' });
      break;

    default:
      dotenv.config();
      break;
  }
};

export default dotenvConfig;
