const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  rank: {
    type: Number,
    default: 0,
  },
  numOfRankers: {
    type: Number,
    default: 0,
  },
  numOfReminders: {
    type: Number,
    default: 0,
  },
  numOfSearches: {
    type: Number,
    default: 0,
  },
  numOfAppearences: {
    type: Number,
    default: 0,
  },
  remindersRatio: {
    type: Number,
    default: 0,
  },
  searchesRatio: {
    type: Number,
    default: 0,
  },
  AppearenceRatio: {
    type: Number,
    default: 0,
  },
  popularityScore: {
    type: Number,
    default: 0,
  },
});

mongoose.model("Product", productSchema);
