import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { Tspec } from 'tspec';
import { ProblemDetails } from "../middlewares/problem-details-response";
import { Task, TaskRequest, TaskResponse} from '../models/task';
import createHttpError, { HttpError } from "http-errors";

var createError = require('http-errors');

const router = Router();
let tasks: Task[] = [];

type TasksApiSpec = Tspec.DefineApiSpec<{
    tags: ["Tasks"],
    paths: {
        "/tasks": {
            get: {
                summary: "Get a list of tasks",
                description: "Get all available tasks.",
                responses: { 200: TaskResponse[] },
            },
            post: {
                summary: "Create a task",
                description: "Create a new task",
                body: TaskRequest,
                responses: { 201: TaskResponse },
            },
        },
        "/tasks/{id}": {
            get: {
                summary: "Get a task",
                description: "Get a specific task by ID.",
                path: {
                    /** The identifier of the task to retrieve */
                    id: number
                },
                responses: {
                    200: TaskResponse,
                    404: ProblemDetails
                },
            },
            put: {
                summary: "Update a task",
                description: "Update a specific task by ID.",
                path: {
                    /** The identifier of the task to update */
                    id: number
                },
                body: TaskRequest,
                responses: {
                    200: TaskResponse,
                    404: ProblemDetails
                },
            },
            delete: {
                summary: "Delete a task",
                description: "Delete a specific task by ID.",
                path: {
                    /** The identifier of the task to delete */
                    id: number
                },
                responses: {
                    /** Task deleted */
                    204: "",
                    /** Invalid params */
                    400: ProblemDetails
                    /** Task not found */
                    404: ProblemDetails
                }
            }
        }
    },
}>;

const taskValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('completed').isBoolean().withMessage('Completed must be a boolean'),
];

router.get('/', (req: Request, res: Response<Array<Task>>) => {
    res.json(tasks);
});

router.post('/', taskValidationRules, (req: Request<TaskRequest>, res: Response<TaskResponse>) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const err = new createHttpError.BadRequest("Invalid request");
        throw createHttpError(err.status, err, { invalidParams: errors.array() });
    }

    const task: Task = {
        id: tasks.length + 1,
        title: req.body.title,
        description: req.body.description,
        completed: false,
    };

    tasks.push(task);
    res.status(201).json(task);
});

router.get('/:id', (req: Request, res: Response<Task>) => {
    const task = tasks.find((t) => t.id === parseInt(req.params.id));

    if (!task) {
        throw new createHttpError.NotFound("Task not found");
    } else {
        res.json(task);
    }
});

router.put('/:id', taskValidationRules, (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const err = new createHttpError.BadRequest("Invalid request");
        throw createHttpError(err.status, err, { invalidParams: errors.array() });
    }

    const task = tasks.find((t) => t.id === parseInt(req.params.id));

    if (!task) {
        res.status(404).send('Task not found');
    } else {
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.completed = req.body.completed || task.completed;

        res.json(task);
    }
});

router.delete('/:id', (req: Request, res: Response) => {
    const index = tasks.findIndex((t) => t.id === parseInt(req.params.id));

    if (index === -1) {
        throw new createHttpError.NotFound("Task not found");
    } else {
        tasks.splice(index, 1);
        res.status(204).send();
    }
});

export default router;