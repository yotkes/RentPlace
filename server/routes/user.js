const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const services = require("./services");

router.post("/pay/:id", requireLogin, (req, res) => {
  return services.pay(req.params.id, res);
});

module.exports = router;
