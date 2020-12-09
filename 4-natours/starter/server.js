const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  //console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 💣  Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful! 🙂 ');
  });
//.catch((err) => console.log('ERROR'));

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 997,
// });;

//Start servers
const port = process.env.PORT || 3000;
const server = app.listen(port, 'localhost', () => {
  console.log(`App running on port ${port}...`);
});
// const x = 2;;;
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💣  Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
