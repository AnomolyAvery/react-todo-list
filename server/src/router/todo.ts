import { Router } from 'express';
import todoController from '../controllers/todo';

const todoRouter = Router();

todoRouter.get('/', todoController.getAll);
todoRouter.post('/', todoController.create);
todoRouter.put('/:id', todoController.update);

export default todoRouter;
