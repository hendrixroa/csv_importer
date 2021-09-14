import * as dotenv from 'dotenv';

const isTest = process.env.NODE_ENV === 'test';
const dotFile = isTest ? './env/.test.env' : './env/.env';
dotenv.config({ path: dotFile });

module.exports = [
  {
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: ['src/modules/**/*.entity{.js,.ts}'],
    synchronize: true,
    logging: process.env.DATABASE_LOG_LEVEL === 'true',
  },
];
