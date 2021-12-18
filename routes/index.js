const router = require("express").Router();

// Display home page 
router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;