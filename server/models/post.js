const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
  status: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  isPurchased: {
    type: Boolean,
  },
  popularityScore: {
    type: Number,
  },
});

mongoose.model("Post", postSchema);
