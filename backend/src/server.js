const app = require('./app');
const port = 8080;

app.listen(port, () => {
  console.log(`Server currently listening to http://localhost:${port}`);
});
