require('dotenv').config();
const connectDB = require('./src/db');
const app = require('./src/app');

async function start() {
  await connectDB();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start();