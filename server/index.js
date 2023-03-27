const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const appRoutes = require("./routes/index");
const app = express();
const PORT = 5000;
mongoose
  .connect(
    "mongodb+srv://user:1234@cluster0.wu3whpt.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("====== Database Connected! ======="))
  .catch((err) => console.log(err));
app.use(cors({
  origin:'http://localhost:5173', 
  credentials:true
}));

app.use(morgan("tiny"));
app.use(cookieParser())
app.use(express.json()); 
app.use(express.static('pictures'))
app.use("/", appRoutes);

app.listen(PORT, () =>
  console.log("<<<<<<<<<<<<< server started >>>>>>>>>>>>>>>>")
);
