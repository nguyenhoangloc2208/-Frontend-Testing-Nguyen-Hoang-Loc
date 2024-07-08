const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routers/useRoutes");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
