const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const Product = mongoose.model("Product");
const Recommendation = mongoose.model("Recommendation");
const Reminder = mongoose.model("Reminder");
const RenterScore = mongoose.model("RenterScore");
const RentHistory = mongoose.model("RentHistory");
const Request = mongoose.model("Request");
const Search = mongoose.model("Search");
const SubCategory = mongoose.model("SubCategory");
const Global = mongoose.model("Global");

var ObjectId = require("mongoose").Types.ObjectId;

global.totalRentsAll = 10;
global.totalRemindersAll = 10;
global.totalSearchesAll = 10;
global.totalProductsAll = 10;
// this is a global dict that contains {userId: {subcategoty: <numOfRents from this sub>})
global.rentsHistoryDict = {};

/**
 * calculateRenterScore
 * The function gets the user id and calculates the renter score
 * The calculation will be trigerred every time a relevant action will occur
 * Relevant Actions: New renter’s review, New product’s (post) review, A rent was finished
 */
const calculateRenterScore = async (userId) => {
  return RenterScore.findOne({ userId: userId }).then((renter) => {
    var score = 0;
    var reviewsScore = renter.reviewsScore;
    var productsScore = renter.productsScore;
    var rentsRatio = renter.rentsRatio;
    score = reviewsScore * 0.4 + productsScore * 0.2 + rentsRatio * 0.4;
    return RenterScore.findByIdAndUpdate(renter._id, { score: score }).then(
      () => {
        return score;
      }
    );
  });
};

/**
 * updateRenterReviewScore
 * The function gets the user id and updates his rank by the current review
 * The update will occur every time a user reviews the renter
 *
 */
const updateRenterReviewScore = async (userId, reviewScore) => {
  var score = 0;
  var reviewsScore = 0;
  var numofReviewers = 0;
  var totalScore = 0;
  var renterId = "";
  return RenterScore.findOne({ userId: userId }).then((renter) => {
    reviewsScore = renter.reviewsScore;
    numofReviewers = renter.numofReviewers;
    renterId = renter._id;
    totalScore = reviewsScore * numofReviewers;
    totalScore += reviewScore;
    numofReviewers += 1;
    reviewsScore = totalScore / numofReviewers;
    return RenterScore.findByIdAndUpdate(renterId, {
      reviewsScore: reviewsScore,
      numofReviewers: numofReviewers,
    }).then(() => {
      return calculateRenterScore(userId).then((score) => {
        return score;
      });
    });
  });
};

/**
 * updateProductReviewScore
 * The function gets the product id and updates his rank by the current review
 * The update will occur every time a user reviews the product he rented
 */
const updateProductReviewScore = async (productId, productRank) => {
  return Product.findOne({ _id: productId }).then((product) => {
    var userId = product.userId;
    var rank = product.rank;
    var numOfRankers = product.numOfRankers;
    var totalranks = rank * numOfRankers;
    totalranks += productRank;
    numOfRankers += 1;
    rank = totalranks / numOfRankers;
    return Product.findByIdAndUpdate(product._id, {
      rank: rank,
      numOfRankers: numOfRankers,
    }).then(() => {
      return User.findOne({ _id: userId }).then((user) => {
        var totalRents = user.totalRents;
        var numOfProducts = user.numOfProducts;
        return RenterScore.findOne({ userId: userId }).then((renter) => {
          var productsScore = renter.productsScore;
          var totalScore = productsScore * (numOfProducts - 1);
          totalScore += rank;
          productsScore = totalScore / 1;
          return RenterScore.findByIdAndUpdate(renter._id, {
            productsScore: productsScore,
          }).then(() => {
            return calculateRenterScore(userId).then((score) => {
              return score;
            });
          });
        });
      });
    });
  });
};

/**
 * updateNumOfRents
 * The function gets a product id and updates the renter's rents number
 * The calculation will occur every time a user rents a product
 */
const updateNumOfRents = async (userId) => {
  const global = await Global.findOneAndUpdate(
    {},
    { $inc: { totalRentsAll: 1 } },
    { new: true }
  ).exec();
  return User.findOne({ _id: userId }).then((user) => {
    var totalRents = user.totalRents;
    var rentsRatio = (totalRents / global.totalRentsAll) * 10;
    return User.findByIdAndUpdate(user._id, { totalRents: totalRents }).then(
      () => {
        return RenterScore.findOne({ userId: userId }).then((renter) => {
          return RenterScore.findByIdAndUpdate(renter._id, {
            rentsRatio: rentsRatio,
          }).then(() => {
            return calculateRenterScore(userId).then((score) => {
              return score;
            });
          });
        });
      }
    );
  });
};

/**
 * calculatePopularityScore
 * The function gets a product id calculates its popularity score
 * The calculation will be trigerred every time a relevant action will occur
 * Relevant Actions: New reminder was set, New search, New product was added
 */
const calculatePopularityScore = async (productId) => {
  return Product.findOne({ _id: productId }).then((product) => {
    var score = 0;
    var rank = product.rank;
    var searchesRatio = product.searchesRatio;
    var AppearenceRatio = product.AppearenceRatio;
    score = rank * 0.3 + searchesRatio * 0.3 + AppearenceRatio * 0.4;
    return Product.findByIdAndUpdate(product._id, {
      popularityScore: score,
    }).then(() => {
      return score;
    });
  });
};

/**
 * updateNumOfReminders
 * The function gets a reminder id and updates number of reminders of the product
 * The calculation will occur every time a user sets a reminder
 * The function returns the new popularity score of the product
 */
const updateNumOfReminders = async (reminderId) => {
  return Reminder.findOne({ reminderId: reminderId }).then((reminder) => {
    totalRemindersAll += 1;
    var productId = reminder.productId;
    return Product.findOne({ _id: productId }).then((product) => {
      var numOfReminders = product.numOfReminders;
      numOfReminders += 1;
      var remindersRatio = (numOfReminders / totalRemindersAll) * 10;
      return Product.findByIdAndUpdate(product._id, {
        remindersRatio: remindersRatio,
        numOfReminders: numOfReminders,
      }).then(() => {
        var score = calculatePopularityScore(productId);
        return score;
      });
    });
  });
};

/**
 * updateNumOfSearches
 * The function gets a search id and updates the number of searches of all the products with the same name
 * The calculation will occur every time a user searches for a product
 * The function returns the new popularity score of the product
 */
const updateNumOfSearches = async (searchId) => {
  productIds = [];
  var productUpdatePromises = [];
  var productsScorePromises = [];
  productsScoreDict = {};
  const global = await Global.findOneAndUpdate(
    {},
    { $inc: { totalSearchesAll: 1 } },
    { new: true }
  ).exec();

  return Search.findOne({ _id: searchId }).then((search) => {
    var productName = search.productName;
    return Product.find({ name: productName }).then((products) => {
      productUpdatePromises = products.map((product) => {
        var productId = product._id;
        productIds.push(productId);
        var numOfSearches = product.numOfSearches;
        numOfSearches += 1;
        var searchesRatio = (numOfSearches / global.totalSearchesAll) * 10;
        return Product.findByIdAndUpdate(product._id, {
          searchesRatio: searchesRatio,
          numOfSearches: numOfSearches,
        });
      });
      return Promise.all(productUpdatePromises).then((productPromises) => {
        productsScorePromises = productIds.map((productId) => {
          return calculatePopularityScore(productId);
        });
        return Promise.all(productsScorePromises).then((productsScore) => {
          for (let i = 0; i < productsScore.length; i++) {
            var id = productIds[i];
            productsScoreDict[id] = productsScore[i];
          }
          return productsScoreDict;
        });
      });
    });
  });
};

/**
 * updateNumOfAppearences
 * The function gets a product id and updates the number of appearence of all the products with the same name
 * The calculation will occur every time a user adds a product
 * The function returns the new popularity score of the product
 */
const updateNumOfAppearences = async (productId) => {
  var productIds = [];
  var productUpdatePromises = [];
  var productsScorePromises = [];
  var productsScoreDict = {};

  const global = await Global.findOneAndUpdate(
    {},
    { $inc: { totalProductsAll: 1 } },
    { new: true }
  ).exec();
  return Product.findOne({ _id: productId }).then((product) => {
    var productName = product.name;
    return Product.find({ name: productName }).then((products) => {
      productUpdatePromises = products.map((product) => {
        var id = product._id;
        productIds.push(id);
        var numOfAppearences = products.length;
        var AppearenceRatio = 10 / numOfAppearences;
        return Product.findByIdAndUpdate(
          product._id,
          {
            AppearenceRatio: AppearenceRatio,
            numOfAppearences: numOfAppearences,
          },
          { new: true }
        );
      });

      return Promise.all(productUpdatePromises).then((productPromises) => {
        productsScorePromises = productIds.map((productId) => {
          return calculatePopularityScore(productId);
        });
        return Promise.all(productsScorePromises).then((productsScore) => {
          for (let i = 0; i < productsScore.length; i++) {
            var id = productIds[i];
            productsScoreDict[id] = productsScore[i];
          }
          return productsScoreDict;
        });
      });
    });
  });
};

/**
 * findMaxDict
 * The function gets a number of max required items and a dictionary and returns a list of the max items
 */
const findMaxDict = (num, dict) => {
  var maxList = [];
  var maxKey = "";
  if (Object.keys(dict).length < num) {
    num = Object.keys(dict).length;
  }
  for (var i = 0; i < num; i++) {
    var maxKey,
      maxValue = 0;
    for (const [key, value] of Object.entries(dict)) {
      if (value > maxValue) {
        maxValue = value;
        maxKey = key;
      }
    }
    maxList.push(maxKey);
    delete dict[maxKey];
  }
  return maxList;
};

/**
 * findTopProducts
 * The function gets a subcategories list and returns a list of 3 products with the max popularity score
 */
const findTopProducts = async (subList) => {
  var topProds = [];
  var productsPromises = subList.map((subcategory) => {
    return Product.find({ subcategory: subcategory });
  });
  return Promise.all(productsPromises).then((productslist) => {
    var productsDict = {};
    productslist.forEach((products) => {
      products.forEach((product) => {
        if (product != null) {
          var productId = product._id;
          var popularityScore = product.popularityScore;
          productsDict[productId] = popularityScore;
        }
      });
      if (Object.keys(productsDict).length > 0) {
        var maxThreeProd = findMaxDict(3, productsDict);
        for (let i = 0; i < maxThreeProd.length; i++) {
          if (maxThreeProd[i].length > 0) {
            topProds.push(maxThreeProd[i]);
          }
        }
      }
    });
    return topProds;
  });
};

/**
 * findPostId
 * The function gets a products list and returns their posts IDs
 */
const findPostId = async (prodsList) => {
  var postsList = [];
  var postPromises = prodsList.map((productId) => {
    return Post.findOne({ productId: productId });
  });
  return Promise.all(postPromises).then((posts) => {
    var postsListPromises = posts.map((post) => {
      var postId = post._id;
      postsList.push(postId);
    });
    return Promise.all(postsListPromises).then(() => {
      return postsList;
    });
  });
};

/**
 * calculateRecommendation
 * The function gets a user id and calculates a Recommendation list
 * The calculation will be trigerred every time a relevant action will occur
 * Relevant Actions: New registration set interests, New search, New rent
 */
const calculateRecommendation = async (userId) => {
  var recommScore = {};
  return Recommendation.findOne({ userId: userId }).then((recomm) => {
    var interestsScore = recomm.interestsScore;
    var searchesScore = recomm.searchesScore;
    var rentHistoryScore = recomm.rentHistoryScore;
    var rentsofOthersScore = recomm.rentsofOthersScore;

    return SubCategory.find({}).then((subcategories) => {
      subcategories.map((subcategory) => {
        var name = subcategory.name;
        var interests = interestsScore[name];
        var searches = searchesScore[name];
        var rentHistory = rentHistoryScore[name];
        var rentsofOthers = rentsofOthersScore[name];
        var totalScore =
          0.5 * interests +
          0.25 * rentHistory +
          0.15 * rentsofOthers +
          0.1 * searches;
        recommScore[name] = totalScore;
      });
      var maxThreeSub = findMaxDict(3, recommScore);
      return findTopProducts(maxThreeSub).then((topProds) => {
        return findPostId(topProds).then((postsList) => {
          return postsList;
        });
      });
    });
  });
};

/**
 * getUserInterests
 * The function gets a user id and takes the user's interests
 * The calculation will occur on the registration process
 * The function returns a list of posts Ids to present to the user as Recommendations
 */
const getUserInterests = async (userId) => {
  var categoryDict = {};
  var subCategoryScores = {};
  return Recommendation.findOne({ userId: userId }).then((recomm) => {
    subCategoryScores = recomm.interestsScore;
    return User.findOne({ _id: userId }).then((user) => {
      var interests = user.interests;
      var interest = "";
      for (const [key, val] of Object.entries(interests)) {
        for (let i = 0; i < val.length; i++) {
          interest = val[i];
          if (categoryDict.hasOwnProperty(key)) {
            categoryDict[key] += 1;
          } else {
            categoryDict[key] = 1;
          }
          subCategoryScores[interest] = 10;
        }
      }
      return SubCategory.find({}) // Check if this finds all docs in the schema
        .then((subcategories) => {
          subcategories.map((subcategory) => {
            var name = subcategory.name;
            if (subCategoryScores[name] == 0) {
              var category = subcategory.category;
              var numOfSub = 0;
              var score = 0;
              if (categoryDict.hasOwnProperty(category)) {
                numOfSub = categoryDict[category];
                score = 4 + 0.5 * numOfSub;
              }
              subCategoryScores[name] = score;
            }
          });
          return Recommendation.findByIdAndUpdate(recomm._id, {
            interestsScore: subCategoryScores,
          }).then(() => {
            return calculateRecommendation(userId).then((postsList) => {
              return postsList;
            });
          });
        });
    });
  });
};

/**
 * updateRentHistory
 * The function gets a user id and updates score of each subcategory by the rent history of the user
 * The calculation will occur every time a user adds a product
 * The function returns a list of posts Ids to present to the user as Recommendations
 */
const updateRentHistory = async (renthistoryId) => {
  var subCategoryScores = {};
  var subcategories = [];
  // get renthistory obj by id
  return RentHistory.findOne({ _id: renthistoryId }).then((renthistory) => {
    var subcategory = renthistory.subcategory;
    var user = renthistory.renteeId;
    return Recommendation.findOne({ userId: user }).then((recomm) => {
      subCategoryScores = recomm.rentHistoryScore;
      subCategoryScores[subcategory] = 10;
      subcategories.push(subcategory);
      return SubCategory.findOne({ name: subcategory })
        .then((subobj) => {
          var category = subobj.category;
          return SubCategory.find({ category: category }).then(
            (subcategories) => {
              subcategories.map((subobj) => {
                var sub = subobj.name;
                if ((sub != subcategory) & (subCategoryScores[sub] == 0)) {
                  subCategoryScores[sub] = 5;
                }
              });
            }
          );
        })
        .then(() => {
          return Recommendation.findByIdAndUpdate(recomm._id, {
            rentHistoryScore: subCategoryScores,
          }).then(() => {
            return calculateRecommendation(user).then((postsList) => {
              return postsList;
            });
          });
        });
    });
  });
};

const calcRentsByRentee = (
  rentees,
  totalRentsUser,
  subCategoryTotals,
  subCategoryScores,
  rentsHistoryDict
) => {
  var totalRents = 0;
  var numOfRentees = rentees.length;
  for (let i = 0; i < numOfRentees; i++) {
    var rentee = rentees[i];
    var subcategory = rentsHistoryDict[rentee];
    for (let key in subcategory) {
      totalRents += 1;
      if (subCategoryTotals.hasOwnProperty(key)) {
        subCategoryTotals[key] += subcategory[key];
      } else {
        subCategoryTotals[key] = subcategory[key];
      }
    }
    for (let key in subCategoryTotals) {
      var ave = subCategoryTotals[key] / numOfRentees;
      subCategoryScores[key] = (ave / totalRentsUser) * 10;
    }
  }
  return subCategoryScores, totalRents;
};

const aveRents = (searchesScore, totalRents, subCategoryScores) => {
  for (let key in searchesScore) {
    if (totalRents > 0) {
      var total = searchesScore[key] * totalRents;
      if (subCategoryScores.hasOwnProperty(key)) {
        searchesScore[key] = (subCategoryScores[key] + total) / totalRents;
      } else {
        searchesScore[key] = total / totalRents;
      }
    } else {
      searchesScore[key] = 0;
    }
  }
  return searchesScore;
};

/**
 * updateOtherRentHistory
 * The function gets a product id and updates the number of appearence of all the products with the same name
 * The calculation will occur every time a user adds a product
 * The function returns a list of posts Ids to present to the user as Recommendations
 */
const updateOtherRentHistory = async (renthistoryId) => {
  const global = await Global.findOne({});
  var rentsHistoryDict = global.rentsHistoryDict;
  var subCategoryScores = {};
  var subCategoryTotals = {};
  var rentees = [];
  var totalRentsUser = 0;
  var userId = "";
  var totalRents = 0;
  // get the search obj
  return RentHistory.findOne({ _id: renthistoryId }).then((renthistory) => {
    var product = renthistory.productName;
    userId = renthistory.renteeId;
    // get the user obj of the searcher
    return User.findOne({ _id: userId }).then((user) => {
      totalRentsUser = user.totalRents;
      // get the recommendation obj of this user
      return Recommendation.findOne({ userId: userId }).then((recomm) => {
        rentsofOthersScore = recomm.rentsofOthersScore;
        // get all rents history of the searched product
        return RentHistory.find({ productName: product }).then(
          (rentshistory) => {
            // go over all the rents history and save the rentees
            var renthistoryByUserPromises = rentshistory.map((renthistory) => {
              var rentee = renthistory.renteeId;
              if (!rentees.includes(rentee)) {
                rentees.push(rentee);
              }
              // if the rentee is not in the global rentHistoryDict get all his rents history
              if (!rentsHistoryDict.hasOwnProperty(rentee)) {
                // get all rents history of the current rentee
                return RentHistory.find({ renteeId: rentee });
              }
            });
            return Promise.all(renthistoryByUserPromises).then(
              (rentshistoryOfUser) => {
                // save the number of rents from each subcategory in dict
                rentshistoryOfUser.forEach((rentshistory) => {
                  var sabcategoriesDict = {};
                  var rentee = "";
                  rentshistory.forEach((renthistory) => {
                    var subcategory = renthistory.subcategory;
                    rentee = renthistory.renteeId;
                    if (sabcategoriesDict.hasOwnProperty(subcategory)) {
                      sabcategoriesDict[subcategory] += 1;
                    } else {
                      sabcategoriesDict[subcategory] = 1;
                    }
                  });
                  rentsHistoryDict[rentee] = sabcategoriesDict;
                });
                // Calculate Search score by rentee
                subCategoryScores,
                  (totalRents = calcRentsByRentee(
                    rentees,
                    totalRentsUser,
                    subCategoryTotals,
                    subCategoryScores,
                    rentsHistoryDict
                  ));
                // Averaging over all iterations
                rentsofOthersScore = aveRents(
                  rentsofOthersScore,
                  totalRents,
                  subCategoryScores
                );
                return Recommendation.findByIdAndUpdate(recomm._id, {
                  rentsofOthersScore: rentsofOthersScore,
                }).then(() => {
                  return calculateRecommendation(userId).then((postsList) => {
                    const global = Global.findOneAndUpdate({
                      rentsHistoryDict: rentsHistoryDict,
                    });
                    return postsList;
                  });
                });
              }
            );
          }
        );
      });
    });
  });
};

const calcSearchByRentee = (
  rentees,
  totalSearches,
  subCategoryTotals,
  subCategoryScores,
  rentsHistoryDict
) => {
  var totalRents = 0;
  var numOfRentees = rentees.length;
  for (let i = 0; i < numOfRentees; i++) {
    var rentee = rentees[i];
    var subcategory = rentsHistoryDict[rentee];
    for (let key in subcategory) {
      totalRents += 1;
      if (subCategoryTotals.hasOwnProperty(key)) {
        subCategoryTotals[key] += subcategory[key];
      } else {
        subCategoryTotals[key] = subcategory[key];
      }
    }
    for (let key in subCategoryTotals) {
      var ave = subCategoryTotals[key] / numOfRentees;
      subCategoryScores[key] = (ave / totalSearches) * 10;
    }
  }
  return subCategoryScores, totalRents;
};

const aveSearches = (searchesScore, totalRents, subCategoryScores) => {
  for (let key in searchesScore) {
    if (totalRents > 0) {
      var total = searchesScore[key] * totalRents;
      if (subCategoryScores.hasOwnProperty(key)) {
        searchesScore[key] = (subCategoryScores[key] + total) / totalRents;
      } else {
        searchesScore[key] = total / totalRents;
      }
    } else {
      searchesScore[key] = 0;
    }
  }
  return searchesScore;
};

/**
 * updateSearches
 * The function gets a product id and updates the number of appearence of all the products with the same name
 * The calculation will occur every time a user adds a product
 * The function returns a list of posts Ids to present to the user as Recommendations
 */
const updateSearches = async (searchId) => {
  const global = await Global.findOne({});
  var rentsHistoryDict = global.rentsHistoryDict;
  var subCategoryScores = {};
  var subCategoryTotals = {};
  var searchesScore = {};
  var rentees = [];
  var totalSearches = 0;
  var userId = "";
  var totalRents = 0;
  // get the search obj
  return Search.findOne({ _id: searchId }).then((search) => {
    var product = search.productName;
    userId = search.userId;
    // get the user obj of the searcher
    return User.findOne({ _id: userId }).then((user) => {
      totalSearches = user.totalSearches;
      // get the recommendation obj of this user
      return Recommendation.findOne({ userId: userId }).then((recomm) => {
        searchesScore = recomm.searchesScore;
        // get all rents history of the searched product
        return RentHistory.find({ productName: product }).then(
          (rentshistory) => {
            // go over all the rents history and save the rentees
            var renthistoryByUserPromises = rentshistory.map((renthistory) => {
              var rentee = renthistory.renteeId;
              if (!rentees.includes(rentee)) {
                rentees.push(rentee);
              }
              // if the rentee is not in the global rentHistoryDict get all his rents history
              if (!rentsHistoryDict.hasOwnProperty(rentee)) {
                // get all rents history of the current rentee
                return RentHistory.find({ renteeId: rentee });
              }
            });
            return Promise.all(renthistoryByUserPromises).then(
              (rentshistoryOfUser) => {
                // save the number of rents from each subcategory in dict
                rentshistoryOfUser.forEach((rentshistory) => {
                  var sabcategoriesDict = {};
                  var rentee = "";
                  rentshistory.forEach((renthistory) => {
                    var subcategory = renthistory.subcategory;
                    rentee = renthistory.renteeId;
                    if (sabcategoriesDict.hasOwnProperty(subcategory)) {
                      sabcategoriesDict[subcategory] += 1;
                    } else {
                      sabcategoriesDict[subcategory] = 1;
                    }
                  });
                  rentsHistoryDict[rentee] = sabcategoriesDict;
                });
                // Calculate Search score by rentee
                subCategoryScores,
                  (totalRents = calcSearchByRentee(
                    rentees,
                    totalSearches,
                    subCategoryTotals,
                    subCategoryScores,
                    rentsHistoryDict
                  ));
                // Averaging over all iterations
                searchesScore = aveSearches(
                  searchesScore,
                  totalRents,
                  subCategoryScores
                );
                return Recommendation.findByIdAndUpdate(recomm._id, {
                  searchesScore: searchesScore,
                }).then(() => {
                  return calculateRecommendation(userId).then((postsList) => {
                    const global = Global.findOneAndUpdate({
                      rentsHistoryDict: rentsHistoryDict,
                    });
                    return postsList;
                  });
                });
              }
            );
          }
        );
      });
    });
  });
};

/**
 * updateOtherRentHistory
 * The function gets a product id and updates the number of appearence of all the products with the same name
 * The calculation will occur every time a user adds a product
 * The function returns a list of posts Ids to present to the user as Recommendations
 */
const findMostWanted = async () => {
  requestsDict = {};
  var mostWanted = [];
  return Request.find({}).then((requests) => {
    requests.map((request) => {
      var name = request.productName;
      var numOfRequests = request.numOfRequests;
      requestsDict[name] = numOfRequests;
    });
    mostWanted = findMaxDict(5, requestsDict);
    return mostWanted;
  });
};
/**
 * exports module
 */
module.exports = {
  calculateRenterScore,
  updateRenterReviewScore,
  updateProductReviewScore,
  updateNumOfRents,
  calculatePopularityScore,
  updateNumOfReminders,
  updateNumOfSearches,
  updateNumOfAppearences,
  calculateRecommendation,
  getUserInterests,
  updateRentHistory,
  updateOtherRentHistory,
  updateSearches,
  findMostWanted,
};
