require('dotenv').config();
const connectDB = require('./src/db');
const app = require('./src/app');

async function start() {
  try {
    await connectDB();
    console.log('MongoDB connected!');

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();