import { request, Request, Response } from 'express';
import { prisma } from '../db/prisma';

const getAll = async (req: Request, res: Response) => {
    try {
        const todos = await prisma.todoItem.findMany({});

        res.status(200).json(todos);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const create = async ({ body }: Request, res: Response) => {
    try {
        const { name, isComplete } = body;

        if (!name) {
            res.status(400).json({ message: 'Invalid data' });
            return;
        }

        const todo = await prisma.todoItem.create({
            data: {
                name,
                isComplete: isComplete || false,
            },
        });

        res.status(201).json(todo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const update = async ({ body, params }: Request, res: Response) => {
    try {
        const { id } = params;

        const { isComplete } = body;

        if (!id) {
            return res.status(400).json({ message: 'Invalid data' });
        }

        const todo = await prisma.todoItem.update({
            where: {
                id,
            },
            data: {
                isComplete: isComplete || false,
            },
        });

        res.status(200).json(todo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const todoController = {
    getAll,
    create,
    update,
};

export default todoController;
