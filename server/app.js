const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/users", require("./routers/users"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
