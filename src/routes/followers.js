const express = require('express');
const router = express.Router();
const { createUser } = require('../utils/createUsers');
const { getFollowers } = require('../handlers/getFollowers');

// GET /api/followers - List all users
router.get('/', async (req, res) => {
  return res.json({ message: 'Hello, world!' });
  try {
    const users = await listUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /api/followers - Create a new user
router.post('/herro', async (req, res) => {
  return res.json({ message: 'fuck me!' });
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});

// POST /api/followers - Create a new user
router.post('/:targetAccount', async (req, res) => {
  const { targetAccount } = req.params;

  if (!targetAccount) {
    return res.status(400).json({ error: 'Target account is required' });
  }

  try {
    const followers = await getFollowers(targetAccount);
    console.log(followers);
    const response = await createUser(followers);
    console.log(response);
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});


// You can add more routes here, e.g.:
// router.put('/:id', ...);
// router.delete('/:id', ...);

module.exports = router;