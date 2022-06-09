const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const services = require("./services");

/**
 * get all posts
 */
router.get("/allpost", requireLogin, (req, res) => {
  return services.getAllPosts(res);
});

router.get("/get-recommendations", requireLogin, (req, res) => {
  return services.getRecommendations(req.user._id, res);
});

router.post("/createpost", requireLogin, (req, res) => {
  return services.createPost(req, res);
});

router.put("/updatephoto", requireLogin, (req, res) => {
  return services.updateProfilePhoto(req.user._id, req.body.photo, res);
});

router.put("/addtobag/:id", requireLogin, (req, res) => {
  return services.addItem(req.params.id, req.body.item, res);
});

router.put("/removeitem/:id", requireLogin, (req, res) => {
  const userId = req.params.id;
  const item = req.body.item;
  return services.removeItem(userId, item, res);
});

router.post("/create-rent-history", requireLogin, (req, res) => {
  return services.createRentHistory(req, res);
});

router.post("/createrequest", requireLogin, (req, res) => {
  return services.createRequest(req, res);
});

router.get("/mostwanted", requireLogin, (req, res) => {
  return services.mostWanted(res);
});

router.get("/mypost", requireLogin, (req, res) => {
  return services.getUserPosts(req.user._id, res);
});

router.get("/mycart", requireLogin, (req, res) => {
  return services.getUserCart(req.user._id, res);
});

router.post("/review-post", requireLogin, (req, res) => {
  const { productId, rank } = req.body;
  return services.reviewProduct(productId, rank, res);
});

router.post("/review-renter", requireLogin, (req, res) => {
  const { userId, rank } = req.body;
  return services.reviewRenter(userId, rank, res);
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  return services.deletePost(req.user._id, req.params.postId, res);
});

router.post("/search-post", (req, res) => {
  return services.searchPost(req, res);
});

module.exports = router;
