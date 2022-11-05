import { Router } from 'express';
import todoRouter from './todo';

const mainRouter = Router();

mainRouter.use('/todos', todoRouter);

export default mainRouter;
