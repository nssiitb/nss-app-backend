require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const userRoutes = require("./routes/userRoutes");
const initDatabase = require("./models/init");
const cors = require('cors');
const app = express();
app.use(cors());
// Trust the first proxy so req.ip and rate-limiting work correctly behind
// nginx / load balancers that terminate TLS.
app.set("trust proxy", 1);

// Initialize the database tables if they do not exist
initDatabase();

app.use(helmet());

app.use((req, res, next) => {
  console.log(`Request Received: ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
