# Kimchi Stonks
This project will focus on creating a mock stock trading desktop web application. Users can create an account to experiment with different investing and trading techniques to simulate a real trading environment.

## Motivation
Developing this app’s motivation is to promote healthy trading psychology and reduce risky strategies by introducing simulated risk and exercising discipline. 

## Project Showcase
<div>
  <img alt="Login page" src="https://i.imgur.com/H15MCrM.png" width="30%">
  <img alt="Dashboard page" src="https://i.imgur.com/yxMDiP1.png" width="30%">
  <img alt="Buy page" src="https://i.imgur.com/530aT0E.png" width="30%">
</div>
<div>
  <img alt="Dashboard page" src="https://i.imgur.com/16KVsb9.png" width="30%">
  <img alt="Buy page" src="https://i.imgur.com/TOlVxpr.png" width="30%">
</div>

## Technology Stack
- **MongoDB** (NoSQL Database)
- **Node & Express** (Backend)
- **React** (Frontend)
- More information can be found in our [Architecture](https://github.com/csdoris/Group-7-Lilac-Lion/wiki/Architecture) wiki

## Features
- Real time stock market look up
- Buy and sell with real world prices
- Stock price predictions
- Improve of trading psychology
- Supports smaller sized devices such as tablets and iPads

## Installation and how to use
The project can be obtained by either downloading directly via this GitHub repo or cloned by running the following command:

`git clone https://github.com/csdoris/Group-7-Kimchi-Stonks.git`

It is required that [node](https://nodejs.org/en/) is installed before running the following commands.

#### Firstly, we want to navigate into the backend folder to perform a clean install of our dependencies and start it up.

```
$ cd Group-7-Kimchi-Stonks/
$ cd backend/
$ npm ci
added XXX packages in Xs
$ npm start
```

#### We should expect this message in whatever terminal is being used:

```
[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node src/server.js`
Server currently listening to http://localhost:8080
Connection to MongoDB successful.
```

#### Next we will do the same in the frontend folder

```
$ cd frontend/
$ npm ci
added XXX packages in Xs
$ npm start
```

#### And we expect this message:

```
Compiled successfully!

You can now view kimchi-stonks-app in the browser.

  http://localhost:3000

Note that the development build is not optimized. 
To create a production build, use npm run build. 
```

## Code style
Code style is enforced by [ESLint](https://eslint.org/) and linting can be done by the following command:

`npm run lint`

## API Reference

API Keys are provided in an `.env` file

- [FMP](https://financialmodelingprep.com/developer)
- [Yahoo Finance](https://finance.yahoo.com/)
- [WSJ](https://www.wsj.com/)

## Backend Testing

Navigate into the backend folder `src/backend` and run the following command:

`npm test`

## How to contribute
For other developers who may want to contribute or create issues, please visit the following wiki links:
- [Workflow](https://github.com/csdoris/Group-7-Lilac-Lion/wiki/Workflow)
- [GitHub issues](https://github.com/csdoris/Group-7-Lilac-Lion/wiki/GitHub-Issues)
- [Pull Requests (PR)](https://github.com/csdoris/Group-7-Lilac-Lion/wiki/Pull-Requests-(PR))

## Contributors

Found [here](https://github.com/csdoris/Group-7-Lilac-Lion/wiki/Contributors)
