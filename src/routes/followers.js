const express = require('express');
const router = express.Router();
const { createUser, listUsers } = require('../handlers/createUsers');

// GET /api/followers - List all users
router.get('/', async (req, res) => {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /api/followers - Create a new user
router.post('/', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});

// You can add more routes here, e.g.:
// router.put('/:id', ...);
// router.delete('/:id', ...);

module.exports = router;