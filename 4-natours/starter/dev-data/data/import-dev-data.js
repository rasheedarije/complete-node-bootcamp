const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: '../../config.env' });

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

const tours = JSON.parse(fs.readFileSync('tours.json', 'utf-8'));
const reviews = JSON.parse(fs.readFileSync('reviews.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Tour Data successfully loaded');
    await User.create(users, { validateBeforeSave: false });
    console.log('User Data successfully loaded');
    await Review.create(reviews);
    console.log('Review Data successfully loaded');

    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

// Delete all data from D3fyuS9ETdBBw5lOwceTMuZcDTyVq28ieeGUAanIuLMcSDz6bpfIe
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data Successfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
