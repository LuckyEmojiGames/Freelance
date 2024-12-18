const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  description: String,
  file: Object,
  price: Number,
  deadline: String,
  currency: String,
  telegramUser: {
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, default: '' },
    username: { type: String, default: '' },
    language_code: { type: String, default: '' },
  },
});

module.exports = mongoose.model('Task', TaskSchema);
