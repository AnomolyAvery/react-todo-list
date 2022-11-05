import express from 'express';
import cors from 'cors';
import mainRouter from './router/main';

const app = express();
app.use(express.json());

app.use(cors());

app.use('/api', mainRouter);

app.listen(4000, () => console.log('Server is running on localhost:4000'));
