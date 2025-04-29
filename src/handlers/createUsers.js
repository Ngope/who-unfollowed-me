const User = require('./schemas/user'); // Adjust path as needed

// Example: Create a new user
async function createUser() {
  const user = new User({
    id: '123',
    created_at: new Date().toISOString(),
    followers: 'some_follower_id',
    followers_count: 10,
  });

  await user.save();
  console.log('User saved!');
}

// Example: Find all users
async function listUsers() {
  const users = await User.find();
  console.log(users);
}
