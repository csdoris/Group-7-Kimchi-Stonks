const app = require('./app');

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server currently listening to http://localhost:${port}`);
});
