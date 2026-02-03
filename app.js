const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use((req, res, next) => {
  console.log(`Request Received: ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', userRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});