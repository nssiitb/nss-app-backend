require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const initDatabase = require("./models/init");

const app = express();

// Initialize the database tables if they do not exist
initDatabase();

app.use((req, res, next) => {
  console.log(`Request Received: ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
