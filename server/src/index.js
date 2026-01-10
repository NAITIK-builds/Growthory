import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow all origins for development
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Growthory API is running');
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`- Local:   http://localhost:${PORT}`);
    console.log(`- Network: http://<YOUR_IP_ADDRESS>:${PORT}`);
  });
}

export default app;
