const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const Product = mongoose.model("Product");
const User = mongoose.model("User");
const Search = mongoose.model("Search");
const Request = mongoose.model("Request");
const Reminder = mongoose.model("Reminder");
const Recommendation = mongoose.model("Recommendation");
const RenterScore = mongoose.model("RenterScore");
const SubCategory = mongoose.model("SubCategory");
const RentHistory = mongoose.model("RentHistory");
const Global = mongoose.model("Global");

const { categories } = require("../../client/src/globals");

const algorithms = require("./algorithms");
const { name } = require("ejs");

global.totalAmount = 0;

/**
 * pay
 * the function gets the user id.
 * find the user corresponding to the id
 * go over it's cart and creating item list.
 * once the list is done it it marks the items as rented.
 *
 *
 * @param {user id} userId
 * @param {res} res
 * @returns res
 */
const pay = (userId, res) => {
  User.findOne({ _id: userId }).then((user) => {
    var itemList = [];
    var total = 0;
    user.cart.map(async (item) => {
      Post.find({ _id: item }).then((post) => {
        var obj = {
          name: post[0].title,
          sku: post[0].price,
          price: post[0].price,
          currency: "ILS",
          quantity: 1,
        };
        total += post[0].price;
        itemList.push(obj);
      });
      Post.findByIdAndUpdate(
        item,
        { $set: { isPurchased: true } },
        { new: true },
        (err, post) => {
          if (err) {
            return res.status(422).json({ error: "rent failed" });
          } else {
            return post;
          }
        }
      );
    });

    res.json({ status: "Success" });
  });
};

/**
 * getAllPosts
 * the function collect from DB all the posts.
 *
 * @param {res} res
 * @returns {posts} res
 */
const getAllPosts = (res) => {
  Post.find()
    .populate("postedBy", "_id name photo")
    .populate("reviews.postedBy", "_id name")
    .sort({ popularityScore: -1 })
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      res.status(422).json({ error: err });
    });
};

/**
 * getRecommendations
 * ths function collects from DB recommendations for this user.
 *
 * @param {user id} userId
 * @param {res} res
 */
const getRecommendations = async (userId, res) => {
  recomm = [];
  var count = 0;
  var posts = await algorithms.calculateRecommendation(userId);
  await new Promise((resolve) => {
    posts.forEach((postId) => {
      return Post.findById(postId).then((post) => {
        return User.findOne({ _id: post.postedBy }, function (err, result) {
          count += 1;
          if (result._id != userId) {
            recomm.push(post);
            if (count == posts.length) {
              return resolve();
            }
          }
        });
      });
    });
  });
  res.json({ posts: recomm });
};

/**
 * createPost
 * the function gets from the user the request post.
 * and creates a new entity of post in the DB.
 *
 * @param {req} req
 * @returns res
 */
const createPost = async (req, res) => {
  const { title, body, photo, price, category, subCategory, city } = req.body;

  if (!title || !body || !photo || !price || !category || !subCategory) {
    return res.status(422).json({ error: "Please fill in all details" });
  }
  if (price > 5000) {
    return res.status(422).json({ error: "Overpriced product - NOT allowed" });
  }
  req.user.password = undefined;
  const product = new Product({
    userId: req.user._id,
    name: title,
    category,
    subcategory: subCategory,
  });
  product.save().then(() => {
    return algorithms
      .updateNumOfAppearences(product._id)
      .then((popularityScore) => {
        for (const [key, val] of Object.entries(popularityScore)) {
          Post.findOneAndUpdate(
            { productId: key },
            { popularityScore: val }
          ).exec();
        }
      });
  });

  const post = new Post({
    title,
    productId: product._id,
    body,
    photo,
    postedBy: req.user,
    status: "Available",
    price,
    category,
    subCategory,
    city,
    isPurchased: false,
    popularityScore: 0,
  });
  post
    .save()
    .then((result) => {
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $inc: { numOfProducts: 1 },
        }
      ).then(res.json({ post: result }));
    })
    .catch((err) => {
      console.log(err);
    })
    .catch((err) => {
      console.log(err);
    });

  Request.findOneAndDelete({ productName: product.name });
};

/**
 * updateProfilePhoto
 * the function gets the user id and the url photo
 * and update the user photo.
 *
 * @param {res} res
 * @returns res
 */
const updateProfilePhoto = (userId, photo, res) => {
  User.findByIdAndUpdate(
    userId,
    { $set: { photo: photo } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "Upload picture has failed" });
      }
      res.json(result);
    }
  );
};

/**
 * addItem
 * The function gets the user id and the item.
 * And updates the user cart with the new item.
 *
 * @param {userId} userId
 * @param {item} item
 * @returns res
 */
const addItem = (userId, item, res) => {
  if (!item) {
    return res.status(422).json({ error: "Please insert all relevant fields" });
  }

  if (item.status === "Unavailable") {
    return res
      .status(422)
      .json({ error: "We're sorry but the item is currently unavailable" });
  }

  if (item.postedBy._id === userId) {
    return res.status(422).json({
      error:
        "Are you sure you want to add this item? - You uploaded it to the system",
    });
  }

  Post.findByIdAndUpdate(
    item._id,
    { status: "Unavailable" },
    { useFindAndModify: false },
    function (err) {
      if (err) {
        return res.status(422).json({ error: err });
      }
    }
  );

  User.findByIdAndUpdate(
    userId,
    {
      $push: { cart: item._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
};

/**
 * removeItem
 * the function gets the user id and the item.
 * and update the user cart by removing the given item.
 *
 * @param {userId} userId
 * @param {item} item
 * @returns res
 */
const removeItem = (userId, item, res) => {
  if (!item) {
    return res.status(422).json({ error: "Please fill in all details" });
  }

  Post.findByIdAndUpdate(
    item._id,
    { status: "Available", isPurchased: false },
    { useFindAndModify: false },
    function (err) {
      if (err) {
        return res.status(422).json({ error: err });
      }
    }
  );

  User.findByIdAndUpdate(
    userId,
    {
      $pull: { cart: item._id },
    },
    {
      new: true,
    }
  ).exec((err) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(item._id);
    }
  });
};

/**
 * getUserPosts
 * the function gets user id and returns the corresponding posts.
 *
 * @param {userId} userId
 * @returns res
 */
const getUserPosts = (userId, res) => {
  Post.find({ postedBy: userId })
    .populate("postedBy", "_id name")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
};

/**
 * getUserCart
 * the function gets user id and returns the corresponding cart.
 *
 * @param {userId} userId
 * @returns res
 */
const getUserCart = (userId, res) => {
  User.findOne({ _id: userId })
    .populate("postedBy", "_id name")
    .then((user) => {
      var cart = [];
      user.cart.map(async (item) => {
        Post.find({ _id: item }).then((post) => {
          cart.push(post[0]);
        });
      });
      setTimeout(function () {
        res.json({ cart });
      }, 1000);
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
};

/**
 * reviewProduct
 * the function gets product id and rank -
 * then updates the product's rank & popularity score
 * and also updates the renter's renter score
 *
 * @param {productId} productId
 * @param {rank} rank
 * @param {res} res
 */
const reviewProduct = async (productId, rank, res) => {
  const renterScore = await algorithms.updateProductReviewScore(
    productId,
    rank
  );
  return Product.findOne({ _id: productId }).then((product) => {
    return User.findByIdAndUpdate(product.userId, {
      renterScore: renterScore,
    }).then(() => {
      algorithms.calculatePopularityScore(productId);
      res.json({ status: "Success" });
    });
  });
};

/**
 * reviewRenter
 * the function gets user id and rank -
 * then updates the user's renter score
 *
 * @param {userId} userId
 * @param {rank} rank
 * @param {res} res
 */
const reviewRenter = async (userId, rank, res) => {
  var renterScore = await algorithms.updateRenterReviewScore(userId, rank);
  return User.findOne({ _id: userId }).then((user) => {
    return User.findByIdAndUpdate(user._id, { renterScore: renterScore }).then(
      () => {
        res.json({ status: "Success" });
      }
    );
  });
};

/**
 * deletePost
 * the function gets the user id and post id
 * finds the post by it's id and removing it.
 *
 * @param {userId} userId
 * @param {postId} postId
 * @param {res} res
 */
const deletePost = (userId, postId, res) => {
  Post.findOne({ _id: postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === userId.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      }
    });
};

/**
 * searchPost
 * the function gets the query
 * and finds all the relevant posts to that query.
 *
 * @param {req} req
 * @param {res} res
 */
const searchPost = async (req, res) => {
  const { userId, productName, category, subcategory, city } = req.body;

  User.findOneAndUpdate(
    { _id: userId },
    {
      $inc: { totalSearches: 1 },
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    }
  });

  Post.find({
    title: productName,
    category: category,
    subCategory: subcategory,
    city: city,
  })
    .sort({ popularityScore: -1 })
    .then((results) => {
      res.json({ results });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });

  const search = new Search({
    userId: userId,
    productName: productName,
  });
  search.save().then(() => {
    var searchId = search._id;
    return algorithms.updateNumOfSearches(searchId).then((popularityScore) => {
      for (const [key, val] of Object.entries(popularityScore)) {
        Post.findOneAndUpdate(
          { productId: key },
          { popularityScore: val }
        ).exec();
      }
      return algorithms.updateSearches(search._id);
    });
  });
};

/**
 * createRentHistory
 * the function gets the request post.
 * and creates a new entity of rentHistory in the DB.
 *
 * @param {req} req
 * @returns res
 */
const createRentHistory = (req, res) => {
  const { renterId, renteeId, productName, subcategory } = req.body;
  const rentHistory = new RentHistory({
    renterId: renterId,
    renteeId: renteeId,
    productName: productName,
    subcategory: subcategory,
  });
  rentHistory
    .save()
    .then(() => {
      return algorithms.updateNumOfRents(renterId);
    })
    .then((renterScore) => {
      User.findOne({ _id: renterId }).then((user) => {
        let totalRents = user.totalRents;
        totalRents += 1;
        return User.findByIdAndUpdate(user._id, {
          renterScore: renterScore,
          totalRents: totalRents,
        }).then(() => {
          return algorithms
            .updateRentHistory(rentHistory._id)
            .then((recommendations) => {
              return algorithms
                .updateOtherRentHistory(rentHistory._id)
                .then((recommendations) => {
                  res.json({ status: "Success" });
                });
            });
        });
      });
    });
};

/**
 * createRequest
 * the function gets from the user the request data.
 * and creates a new entity of requested product in the DB.
 *
 * @param {req} req
 * @returns res
 */
const createRequest = (req, res) => {
  const { productName, category, subcategory } = req.body;

  if (!productName || !category || !subcategory) {
    return res.status(422).json({ error: "Please fill in all details" });
  }

  Request.findOne({
    productName: productName,
    category: category,
    subcategory: subcategory,
  }).then((request) => {
    if (request != null) {
      Request.findOneAndUpdate(
        { _id: request._id },
        { $inc: { numOfRequests: 1 } }
      ).then(res.json({}));
    } else {
      var numOfRequests = 1;
      const request = new Request({
        productName,
        category,
        subcategory,
        numOfRequests,
      });
      request.save().then((result) => {
        res.json({ request: result });
      });
    }
  });
};

/**
 * removeRequest
 * the function gets the user id and the item.
 * and updates the user cart by removing the given item.
 *
 * @param {userId} userId
 * @param {item} item
 * @returns res
 */
const removeRequest = (userId, item, res) => {
  if (!item) {
    return res.status(422).json({ error: "Please insert all relevant fields" });
  }

  Post.findByIdAndUpdate(
    item._id,
    { status: "Available" },
    { useFindAndModify: false },
    function (err) {
      if (err) {
        return res.status(422).json({ error: err });
      }
    }
  );

  User.findByIdAndUpdate(
    userId,
    {
      $pull: { cart: item._id },
    },
    {
      new: true,
    }
  ).exec((err) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(item._id);
    }
  });
};

/**
 * mostWanted
 * the function gets the top-5 most wanted items (by numOfRequests field)
 * and updates the Most Wanted item's list in the homepage
 *
 * @param {res} res
 */
const mostWanted = async (res) => {
  var mostWanted = await algorithms.findMostWanted();
  res.json({ result: mostWanted });
};

/**
 * exports module
 */
module.exports = {
  pay,
  getAllPosts,
  createPost,
  updateProfilePhoto,
  addItem,
  removeItem,
  createRequest,
  removeRequest,
  mostWanted,
  getUserPosts,
  getUserCart,
  reviewProduct,
  reviewRenter,
  deletePost,
  searchPost,
  getRecommendations,
  createRentHistory,
};
