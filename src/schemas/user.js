const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({ 
    created_at: String, 
    followers: [String],
    followers_count: Number,
});

// Add a virtual 'id' field that maps to '_id'
schema.virtual('id').get(function() {
  return this._id.toHexString();
});
schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);