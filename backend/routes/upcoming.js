const express = require("express");
const router = express.Router();
const Upcomingdata = require("../CustomData/Upcomingdata.json");

/**
 * @swagger
 * /upcoming:
 *   get:
 *     summary: Get upcoming movies
 *     description: Returns a list of upcoming movies from the custom JSON file.
 *     responses:
 *       200:
 *         description: A list of upcoming movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "Avengers: Secret Wars"
 *                       releaseDate:
 *                         type: string
 *                         example: "2026-05-01"
 */

/**
 * @swagger
 * /upcoming:
 *   get:
 *     summary: Get upcoming movies
 *     description: Returns a list of upcoming movies.
 *     responses:
 *       200:
 *         description: List of upcoming movies
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: Upcomingdata,
  });
});

module.exports = router;