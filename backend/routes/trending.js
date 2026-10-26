const { json } = require("body-parser");
const router = require("express").Router();
const TrendingData = require("../CustomData/TrendingData.json");

router.get("/", (req, res) => {
  // Dummy trending data
  const trendingItems = TrendingData;
  res.status(200).json({
    success: true,
    data: trendingItems,
  });
});
/**
 * @swagger
 * /trending:
 *   get:
 *     summary: Get trending movies
 *     description: Returns a list of trending movies.
 *     responses:
 *       200:
 *         description: List of trending movies
 */
module.exports = router;