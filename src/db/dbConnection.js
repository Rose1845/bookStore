const mongoose = require("mongoose");

module.exports = mongoose
  .connect(
    "mongodb+srv://dev_rose:Atieno_20.raocluster.oautq.mongodb.net/bookStore?retryWrites=true&w=majority"
  )
  .then(() => console.log("connected to db"))
  .catch((error) => console.log(error));
