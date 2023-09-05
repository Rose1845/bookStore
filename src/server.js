const express = require("express");
const app = express();
const { default: mongoose } = require("mongoose");
const PORT = 5555;
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const bookRouter = require("./routes/book.js");
const userRouter = require("./user/routes/user");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
require("dotenv").config();

app.use("/books", bookRouter);
app.use("/auth", userRouter);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to db"))
  .catch((error) => console.log(error));
app.listen(PORT, function () {
  console.log(`Server is running on: ${PORT}`);
});
