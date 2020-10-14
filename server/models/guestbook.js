import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

let guestbookSchema = new Schema({
  card_id : String,
  name : String,
  password : String,
  regDttm : { type: Date, default: Date.now},
  text : String
});

guestbookSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, 8);
};

// compares the password
guestbookSchema.methods.validateHash = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('guestbook', guestbookSchema);
