if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const mongoose = require("mongoose");

const configureAuthGoogle = require("./config/passport-google-config");

const indexRouter = require("./routes/index");
const authGoogleRouter = require("./routes/authGoogleRouter");
const authLocalRouter = require("./routes/authLocalRouter.js");

const app = express();

app.use(cors());

// View engine etup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "front/build")));

configureAuthGoogle(app);

// ================================ Modificar para no usar mongoose ================================
// DB config
const db = process.env.MONGO_URI;

// connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// ================================ Modificar para no usar mongoose ================================

// set up routes
app.use("/", indexRouter);
app.use("/auth", authGoogleRouter);
app.use("/authLocal", authLocalRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
