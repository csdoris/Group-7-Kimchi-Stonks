import { MongoMemoryServer } from 'mongodb-memory-server';
import { matchers } from 'jest-json-schema';
import mongoose from 'mongoose';
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import authRoutes from '../auth';
import dashboardRoutes from '../dashboard';

let mongod;
let server;
let accessToken;
expect.extend(matchers);

/**
 * Before any tests start, make an instance of the applications mongoDB within the memory of the program.
 * Also, start an express server
 */
beforeAll(async (done) => {
  dotenv.config();
  mongod = new MongoMemoryServer();

  const connectionString = await mongod.getUri();
  await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

  const app = express();
  app.use(express.json());
  app.use('/', authRoutes);
  app.use('/dashboard', dashboardRoutes);
  server = app.listen(3000, () => done());
});

/**
 * Before each test, create a user account and get the access token to authenticate the dashboard endpoints
 */
beforeEach(async () => {
  await axios.post('http://localhost:3000/register', {
    firstName: 'Test',
    lastName: 'Test',
    email: 'test@test.com',
    password: 'password',
  }).then((res) => {
    accessToken = res.data.user.accessToken.token;
  });
});

/**
 * After each test, clear the user data.
 */
afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

/**
 * After all tests, kill the in-memory MongoDB instance and stop the express server.
 */
afterAll(async () => {
  server.close(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });
});

it('check the search endpoint returns data in the correct format', async () => {
  const schema = {
    properties: {
      matches: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            symbol: { type: 'string' },
            name: { type: 'string' },
          },
        },
        minItems: 1,
        maxItems: 1,
      },
    },
  };

  await axios.get('http://localhost:3000/dashboard/search?keyword=AAPL', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => {
    expect(res.status).toBe(200);
    expect(res.data).toMatchSchema(schema);
  });
});

it('check the trending endpoint returns data in the correct format', async () => {
  const schema = {
    properties: {
      mostGainerStock: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            ticker: { type: 'string' },
            changes: { type: 'number' },
            price: { type: 'string' },
            changesPercentage: { type: 'string' },
            companyName: { type: 'string' },
          },
        },
        minItems: 30,
        maxItems: 30,
      },
    },
  };

  await axios.get('http://localhost:3000/dashboard/trending-stocks', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => {
    expect(res.status).toBe(200);
    expect(res.data).toMatchSchema(schema);
  });
});

it('check the overview endpoint returns data in the correct format', async () => {
  const schema = {
    properties: {
      matches: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            symbol: { type: 'string' },
            name: { type: 'string' },
          },
        },
        minItems: 1,
        maxItems: 1,
      },
    },
  };

  await axios.get('http://localhost:3000/dashboard/search?keyword=AAPL', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => {
    expect(res.status).toBe(200);
    expect(res.data).toMatchSchema(schema);
  });
});

it('check the predict price endpoint returns data in the correct format', async () => {
  const schema = {
    properties: {
      prediction: { type: 'number' },
    },
  };

  await axios.get('http://localhost:3000/dashboard/predict-price/AAPL', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => {
    expect(res.status).toBe(200);
    expect(res.data).toMatchSchema(schema);
  });
});

const timeSeriesSchema = {
  properties: {
    metaData: {
      type: 'object',
      properties: {
        symbol: { type: 'string' },
        interval: { type: 'string' },
      },
    },
    timeSeriesData: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          xAxis: { type: 'string' },
          open: { type: 'number' },
          high: { type: 'number' },
          low: { type: 'number' },
          close: { type: 'number' },
          volume: { type: 'number' },
        },
      },
      minItems: 1,
    },
  },
};

it('check the intraday endpoint returns data in the correct format', async () => {
  await axios.get('http://localhost:3000/dashboard/time-series/intraday/AAPL', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => {
    expect(res.status).toBe(200);
    expect(res.data).toMatchSchema(timeSeriesSchema);
    expect(res.data.metaData.interval).toBe('30min');
  });
});

it('check the daily endpoint returns data in the correct format', async () => {
  await axios.get('http://localhost:3000/dashboard/time-series/daily/AAPL', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => {
    expect(res.status).toBe(200);
    expect(res.data).toMatchSchema(timeSeriesSchema);
    expect(res.data.metaData.interval).toBe('Daily');
  });
});

it('check the monthly endpoint returns data in the correct format', async () => {
  await axios.get('http://localhost:3000/dashboard/time-series/monthly/AAPL', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => {
    expect(res.status).toBe(200);
    expect(res.data).toMatchSchema(timeSeriesSchema);
    expect(res.data.metaData.interval).toBe('Monthly');
  });
});

it('check the yearly endpoint returns data in the correct format', async () => {
  await axios.get('http://localhost:3000/dashboard/time-series/yearly/AAPL', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => {
    expect(res.status).toBe(200);
    expect(res.data).toMatchSchema(timeSeriesSchema);
    expect(res.data.metaData.interval).toBe('Yearly');
  });
});
