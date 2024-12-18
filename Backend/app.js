const express = require("express");
const axios = require('axios');
// const tonService = require('./services/tonService');
const apiRoutes = require('./routes/api'); 
var morgan = require("morgan");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const BOT_TOKEN = "7726947452:AAGy5YJYI1J-A008-dSoJDGOF-3fu31exos";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
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

app.get('/api/telegram/getUsername', async (req, res) => {
  try {
    // Get the latest updates from Telegram
    const response = await axios.get(`${TELEGRAM_API_URL}/getUpdates`);
    const updates = response.data.result;

    if (!updates.length) {
      return res.status(404).json({ message: "No user interactions found." });
    }

    // Extract the latest user's information
    const lastUpdate = updates[updates.length - 1];
    const userInfo = lastUpdate.message?.from;

    if (userInfo) {
      return res.json({
        id: userInfo.id,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name || null,
        username: userInfo.username || "No username",
        language_code: userInfo.language_code || null,
      });
    } else {
      return res.status(404).json({ message: "User information not found." });
    }
  } catch (error) {
    console.error("Error fetching user info from Telegram:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Endpoint to get user profile photos
app.post('/get-user-avatar', async (req, res) => {
  const { userId } = req.body;

  try {
    // Get profile photos
    const profilePhotosResponse = await axios.post(
      `${TELEGRAM_API_URL}/getUserProfilePhotos`,
      { user_id: userId }
    );

    const profilePhotos = profilePhotosResponse.data.result.photos;
    if (!profilePhotos.length) {
      return res.status(404).send('No profile photos found for the user.');
    }

    // Get the first photo's file_id
    const fileId = profilePhotos[0][0].file_id;

    // Get file path
    const fileResponse = await axios.post(
      `${TELEGRAM_API_URL}/getFile`,
      { file_id: fileId }
    );

    const filePath = fileResponse.data.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    res.json({ avatarUrl: fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user avatar.');
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
