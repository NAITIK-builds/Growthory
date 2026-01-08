import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Growthory API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
