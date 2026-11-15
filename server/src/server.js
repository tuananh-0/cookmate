import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';

const port = process.env.PORT || 5000;
const host = '0.0.0.0';

connectDatabase()
  .then(() => {
    app.listen(port, host, () => {
      console.log(`CookMate API is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  });
