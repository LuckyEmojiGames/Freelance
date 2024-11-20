const express = require("express");
const tonService = require('./services/tonService');
const apiRoutes = require('./routes/api'); 
var morgan = require("morgan");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
// middlewares
app.use(cors({
  origin : "*"
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie middlewares
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use('/api', apiRoutes);
// API endpoint to get account details
app.get('/api/account/:address', async (req, res) => {
  const { address } = req.params;
  try {
      const accountDetails = await tonService.getAccountDetails(address);
      res.json(accountDetails);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// API endpoint to send a transaction
app.post('/api/transaction', async (req, res) => {
  const { fromAddress, toAddress, amount } = req.body;
  try {
      const result = await tonService.sendTransaction(fromAddress, toAddress, amount);
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// morgan middleware
app.use(morgan("tiny"));

// import all routes
const home = require("./routes/home");
const user = require("./routes/user")
const jobs = require("./routes/job");
const message = require("./routes/message");
const payment = require("./routes/payment");


// router middleware
app.use("/api/v1",home);
app.use("/api/v1",user);
app.use("/api/v1",jobs);
app.use("/api/v1",message);
app.use("",payment);

// payments
app.use("/stripe", express.raw({ type: "*/*" }));

// exports
module.exports = app;
