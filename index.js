const express = require("express");
const app = express();
const PORT = 8001;
const path = require('path')
const cookieParser = require('cookie-parser')
const URL = require("./models/url");
const { connectToMongoDB } = require("./connect");

// Routers
const staticRoute = require('./route/staticRouter')
const urlRoute = require("./route/url");
const userRoute = require('./route/user');
const { restrictTo, checkForAuthentication } = require("./middleware/auth");

app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthentication);

app.use('/url', restrictTo(["NORMAL"]) , urlRoute); 
app.use('/user', userRoute);
app.use('/', staticRoute);
 
app.get("/test", async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", {
    urls: allUrls,
  });
});

connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("MongoDB Started"))
  .catch((err) => {
    console.log("failed to connect to MongoDB:", err);
  });

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));
