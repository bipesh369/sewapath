const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const PORT = 5000;

app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from the backend!",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});