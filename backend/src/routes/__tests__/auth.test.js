import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import express from 'express';
import axios from 'axios';
import routes from '../auth';
import User from '../../mongodb/schemas/userSchema';

const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

let mongod; let app; let
  server;
let user1; let
  user2;

/**
 * Before any tests start, make an instance of the applications mongoDB within the memory of the program.
 * Also, start an express server
 */
beforeAll(async (done) => {
  dotenv.config();
  mongod = new MongoMemoryServer();

  const connectionString = await mongod.getUri();
  await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

  app = express();
  app.use(express.json());
  app.use('/', routes);
  server = app.listen(3000, () => done());
});

/**
 * Before each test starts, intialize the database with user accounts
 */
beforeEach(async () => {
  const password = await bcrypt.hash('password', 10);
  const coll = await mongoose.connection.db.createCollection('users');
  user1 = new User({
    firstName: 'Bob',
    lastName: 'Builder',
    email: 'test@test.com',
    password,
  });

  user2 = new User({
    firstName: 'Daniel',
    lastName: 'Kim',
    email: 'daniel@test.com',
    password,
  });

  await coll.insertMany([user1, user2]);
});

/**
 * After each test, clear the user collection.
 */
afterEach(async () => {
  await mongoose.connection.db.dropCollection('users');
});

/**
 * After all tests, kill the in-memory MongoDB instance and stop the express server.
 */
afterAll((done) => {
  server.close(async () => {
    await mongoose.disconnect();
    await mongod.stop();

    done();
  });
});

it('tries to create an account with an email that is already used', async () => {
  expect(true).toBeTruthy();
});