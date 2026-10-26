require("dotenv").config();

const session = require("express-session");
const express = require("express");
const cors = require("cors");
require("./Passport");

const passport = require("passport");
const authRoute = require("./routes/auth");
const trendingRoute = require("./routes/trending");
const upcomingRoute = require("./routes/upcoming");
const request = require("request");

// Swagger dependencies
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express();

// Parse JSON request bodies
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Session configuration
app.use(
  session({
    name: "session",
    secret: process.env.SESSION_SECRET || "development-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false, // Local development over HTTP
      sameSite: "lax",
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
    servers: [{ url: "http://localhost:5000" }],
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
    `http://127.0.0.1:5000/movie/${req.params.id}`,
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
app.listen(5000, () => {
  console.log("Server is running on PORT 5000");
});