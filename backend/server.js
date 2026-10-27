require("dotenv").config();

const session = require("express-session");
const express = require("express");
const cors = require("cors");
require("./passport");

const passport = require("passport");
const authRoute = require("./routes/auth");
const trendingRoute = require("./routes/trending");
const upcomingRoute = require("./routes/upcoming");
const request = require("request");

// Swagger dependencies
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express();

app.set("trust proxy", 1);

// Parse JSON request bodies
app.use(express.json());

// CORS configuration
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Session configuration

app.use(
  session({
    name: "session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);


// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie Recommendation API",
      version: "1.0.0",
      description: "API documentation for trending and upcoming movies",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://cinegenie-backend-api.onrender.com"
            : "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/auth", authRoute);
app.use("/trending", trendingRoute);
app.use("/upcoming", upcomingRoute);

app.get("/recomm/:id", function (req, res) {
  request(
    `${process.env.RECOMMENDATION_API_URL || "http://127.0.0.1:5001"}/movie/${encodeURIComponent(req.params.id)}`,
    function (error, response, body) {
      if (error) {
        return res.status(500).json({ error: "Failed to fetch recommendations" });
      }

      res.status(response.statusCode || 200).send(body);
    }
  );
});

app.get("/", (req, res) => {
  res.send("CineGenie API is running!");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});