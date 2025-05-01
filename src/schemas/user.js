const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({ 
    username: String,
    created_at: String, 
    followers: [String],
    followers_count: Number,
});

// Add a virtual 'id' field that maps to '_id'
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);