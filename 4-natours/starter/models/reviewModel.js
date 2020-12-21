const mongoose = require('mongoose');
const Tour = require('./tourModel');

// review user - tour reviewd - review text - createdAt - rating
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      minlength: [3, 'reviews must be 15 or more characters long.'],
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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // console.log(tourId);
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  //console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  //this points to current review

  this.constructor.calcAverageRatings(this.tour);
  // next();
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  //console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function (next) {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
