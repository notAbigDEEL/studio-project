const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const StudioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
    unique: true,
    trim: true,
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please enter a description"],
    maxlength: [600, "Description cannot be more than 600 characters"],
  },
  phone: {
    type: String,
    maxlength: [20, "Phone number cannot be more than 20 characters"],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email address",
    ],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  location: {
    //GeoJSON Point
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must at least 1"],
    max: [10, "Rating cannot exceed 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Geocode and create location field
StudioSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].lattitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  //Do not save address in database
  this.address = undefined;

  next();
});

//create studio slug from name
StudioSchema.pre("save", function (next){
  console.log("Slugify ran", this.name)
  next()
})

module.exports = mongoose.model("Studio", StudioSchema);
