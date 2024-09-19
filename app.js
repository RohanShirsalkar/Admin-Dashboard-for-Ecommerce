const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

app.get("/", async (req, res, next) => {
  res.send({ message: "Server is live" });
});

app.use("/api", require("./routes/api.route"));
app.use("/api/user", require("./routes/user.route"));
app.use("/api/address", require("./routes/address.route"));
app.use("/api/cart", require("./routes/cart.route"));
app.use("/api/order", require("./routes/order.route"));
app.use("/api/product", require("./routes/product.route"));
app.use("/api/category", require("./routes/category.route"));
app.use("/api/tag", require("./routes/tags.route"));
app.use("/api/dashboard", require("./routes/dashboard_route"));
app.use("/api/settings", require("./routes/settings.route"));
app.use(
  "/api/upload",
  upload.array("image", 5),
  require("./routes/upload.route")
);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
