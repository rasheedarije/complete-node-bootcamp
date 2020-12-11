const mongoose = require('mongoose');

// review user - tour reviewd - review text - createdAt - rating
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      minlength: [15, 'reviews must be 15 or more characters long.'],
      maxlength: [255, 'reviews must be 255 or less characters long.'],
      required: [true, 'review must have a text associated.'],
      trim: true,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    user: {
      //type: mongoose.Schema.ObjectId,
      type: 'ObjectId',
      ref: 'User',
      required: [true, 'review must be written by a user.'],
    },
    tour: {
      //type: mongoose.Schema.ObjectId,
      type: 'ObjectId',
      ref: 'Tour',
      required: [true, 'review must be long to a tour.'],
    },
    createdAt_: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  {
    timestamps: true,
  }
);

reviewSchema.pre(/^find/, function (next) {
  this //.populate({
    //path: 'tour',
    // select: 'name',
    //})
    .populate({
      path: 'user',
      select: 'name photo',
    });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
