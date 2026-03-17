require("dotenv").config();

const express = require("express");
const app = express();
const userRoutes = require("./routes/user.route");
const cookieParser = require("cookie-parser");
const userMiddleware = require("./middleware/user.middleware");
const urlRoutes = require("./routes/url.route");
const connectDB = require("./database/db");
const cors = require("cors");

connectDB();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/auth", userRoutes);
app.use("/url",userMiddleware, urlRoutes);

port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
