const express = require("express");
const mongoose = require("mongoose");
const Recommendation = mongoose.model("Recommendation");
const RenterScore = mongoose.model("RenterScore");
const SubCategory = mongoose.model("SubCategory");
const Global = mongoose.model("Global");

const { categories } = require("../../client/src/globals");

const algorithms = require("./algorithms");

/**
 * initGlobal
 * the function initializes a global object in DB to handle global variables of the app
 */
const initGlobal = () => {
  Global.findOne({}, function (err, result) {
    if (!result) {
      const global = new Global({
        totalRentsAll: 0,
        totalRemindersAll: 0,
        totalSearchesAll: 0,
        totalProductsAll: 0,
        rentsHistoryDict: [],
      });
      global.save();
    }
  });
};

/**
 * initSubCategory
 * the function gets categories' list and initializes the subcategories' objects in the DB
 */
const initSubCategory = (categories) => {
  return SubCategory.find({}).then((subcategories) => {
    if (subcategories.length == 0) {
      var subCategoryDict = {};
      for (var i = 1; i < categories.length; i++) {
        var category = categories[i]["label"];
        var subcategories = categories[i]["subCategories"];
        for (var j = 1; j < subcategories.length; j++) {
          var subcategory = subcategories[j]["label"];
          subCategoryDict[subcategory] = 0;
          const subCategory = new SubCategory({
            name: subcategory,
            category: category,
          });
          subCategory.save();
        }
      }
    }
  });
};

/**
 * initRecommendations
 * the function gets the user id and the categories' list and initializes
 * the user recommendations' scores
 */
const initRecommendations = (userId) => {
  var subCategoryDict = {};
  for (var i = 1; i < categories.length; i++) {
    var category = categories[i]["label"];
    var subcategories = categories[i]["subCategories"];
    for (var j = 1; j < subcategories.length; j++) {
      var subcategory = subcategories[j]["label"];
      subCategoryDict[subcategory] = 0;
    }
  }
  const recommendation = new Recommendation({
    userId: userId,
    interestsScore: subCategoryDict,
    searchesScore: subCategoryDict,
    rentHistoryScore: subCategoryDict,
    rentsofOthersScore: subCategoryDict,
  });
  recommendation.save().then(() => {
    return algorithms.getUserInterests(userId);
  });
};

/**
 * initRenterScore
 * the function gets the user id and initializes
 * the renter score
 */
const initRenterScore = (userId) => {
  const renterScore = new RenterScore({
    userId: userId,
  });
  renterScore.save();
};

/**
 * exports module
 */
module.exports = {
  initSubCategory,
  initRecommendations,
  initRenterScore,
  initGlobal,
};
