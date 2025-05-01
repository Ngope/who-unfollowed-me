// src/handlers/createUsers.js
const User = require('../schemas/user');

async function createUser(data) {
  try {
    const user = await User.create({
      username: data.username,
      followers: data.followers,
      followers_count: data.followers_count,
      created_at: new Date().toISOString() // Automatically set current timestamp
    });
    
    return user;
  } catch (error) {
    console.error('Error creating user entry:', error);
    throw error;
  }
}

module.exports = { createUser };