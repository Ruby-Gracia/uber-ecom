const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

const product = require("./routes/productRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/api", product);

const db =
  "mongodb+srv://chat-user:16ec007@cluster0.2b4qw.mongodb.net/ecom?retryWrites=true&w=majority";

mongoose.connect(db, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose Connection ERROR: " + err.message);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB Connected!");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
