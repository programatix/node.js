import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import * as Task from '../models/task';
import createHttpError, { HttpError } from "http-errors";
import { Tspec } from 'tspec';

var createError = require('http-errors');

const router = Router();
let tasks: Task.Task[] = [];

type TasksApiSpec = Tspec.DefineApiSpec<{
    tags: ['Tasks'],
    paths: {
        '/tasks': {
            get: {
                summary: "Get a list of tasks",
                description: "",
                responses: { 200: Array<Task.TaskResponse> },
            },
            post: {
                summary: "Creates new task",
                description: "",
                body: Task.TaskRequest,
                responses: { 201: Task.TaskResponse },
            },
        }
    },
}>;

/**
 * @swagger
 * components: {
 *   schemas: {
        TaskRequest: {a
            type: object,
            properties: {
                title: {
                    description: The task title,
                    type: string,
                    required: true
                },
                description: {
                    description: The task description,
                    type: string,
                    required: true
                },
                completed: {
                    description: The task status,
                    type: boolean,
                    required: true
                }
            },
            example: {
                title: Call John Doe,
                description: A note to call John Doe,
                completed: false
            }
        },
        TaskResponse: {
            properties: {
                id: {
                    desciption: The task identifie,
                    type: string
                },
                title: {
                    description: The task title,
                    type: string
                },
                description: {
                    description: The task description,
                    type: string,
                },
                completed: {
                    description: The task status,
                    type: boolean,
                }
            },
            example: {
                title: Call John Doe,
                description: A note to call John Doe,
                completed: false
            }
        }
    }
 }
 */
const taskValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('completed').isBoolean().withMessage('Completed must be a boolean'),
];

/**
 * @swagger
 *  tags: {
 *      name: Tasks,
 *      description: Tasks management
 *  }
 */

/**
 * @swagger
 *  /tasks: {
 *      post: {
            tags: [Tasks],
            summary: Creates new task,
            description: ,
            produces: {
                application/json
            },
            requestBody: {
                required: true,
                content: {
                    application/json: {
                        schema: {
                            $ref: "#/components/schemas/TaskRequest"
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: Created
                }
            }
        }
    }
 */
router.post('/', taskValidationRules, (req: Request<Task.TaskRequest>, res: Response<Task.TaskResponse>) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const err = new createHttpError.BadRequest("Invalid request");
        throw createHttpError(err.status, err, { invalidParams: errors.array() });
    }

    const task: Task.Task = {
        id: tasks.length + 1,
        title: req.body.title,
        description: req.body.description,
        completed: false,
    };

    tasks.push(task);
    res.status(201).json(task);
});

/**
 * @swagger
 * /tasks:
 *  get:
 *      tags: [Tasks]
 *      summary: Get a list of tasks
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Fetched successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/TaskResponse"
 * 
 */
router.get('/', (req: Request, res: Response<Array<Task.Task>>) => {
    res.json(tasks);
});

/**
 * @swagger
 * /tasks/{id}:
 *  get:
 *   tags: [Tasks]
 *   summary: Get a task
 *   description: Get a specific task by ID.
 *   parameters:
 *   - in: path
 *     name: id
 *     required: true
 *     description: ID of the task to retrieve.
 *   schema:
 *    type: string
 *   responses:
 *    200:
 *     description: Fetched successfully
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/TaskResponse"
 *    401:
 *     description: Task not found
 */
router.get('/:id', (req: Request, res: Response<Task.Task>) => {
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