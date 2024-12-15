const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  description: String,
  file: Object,
  price: Number,
  deadline:String,
  currency: String
});

module.exports = mongoose.model('Task', TaskSchema);
