const router = require("express").Router();
const passport = require("passport");

const CLIENT_URL = "http://localhost:3000/";

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/logout", (req, res, next) => {
  req.logout((logoutError) => {
    if (logoutError) {
      return next(logoutError);
    }

    if (!req.session) {
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      res.clearCookie("session", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);
/**
 * @swagger
 * /trending:
 *   get:
 *     summary: Get trending movies
 *     responses:
 *       200:
 *         description: List of trending movies
 */

module.exports = router;