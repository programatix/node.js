import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ProblemDetails } from "../middlewares/problem-details-response";
import { Task, TaskRequest, TaskResponse} from '../models/task';
import createHttpError, { HttpError } from "http-errors";

var createError = require('http-errors');

const router = Router();
let tasks: Task[] = [];

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
 * /tasks:
 *  get:
 *      tags: [Tasks]
 *      summary: Get a list of tasks
 *      description: Get all available tasks.
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
router.get('/', (req: Request, res: Response<Array<Task>>) => {
    res.json(tasks);
});

/**
 * @swagger
 *  /tasks: {
 *      post: {
            tags: [Tasks],
            summary: "Creates new task",
            description: "Create a new task.",
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
                    description: Task created
                }
            }
        }
    }
 */
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
 *     schema:
 *      type: string
 *   responses:
 *    200:
 *     description: Fetched successfully
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/TaskResponse"
 *    404:
 *     description: Task not found
 */
router.get('/:id', (req: Request, res: Response<Task>) => {
    const task = tasks.find((t) => t.id === parseInt(req.params.id));

    if (!task) {
        throw new createHttpError.NotFound("Task not found");
    } else {
        res.json(task);
    }
});

/**
 * @swagger
 *  /tasks: {
 *      put: {
            tags: [Tasks],
            summary: "Update a task",
            description: "Update a specific task by ID.",
            produces: {
                application/json
            },
            parameters: [
                {
                    in: path,
                    name: id,
                    required: true,
                    description: "ID of the task to update.",
                    schema: {
                        type: string
                    }
                }
            ],
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
                200: {
                    description: Task updated,
                    content: {
                        application/json: {
                            schema: {
                                $ref: "#/components/schemas/TaskResponse"
                            }
                        }
                    }
                },
                404: {
                    description: Task not found
                }
            }
        }
    }
 */
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

/**
 * @swagger
 *  /tasks: {
 *      put: {
            tags: [Tasks],
            summary: "Delete a task",
            description: "Delete a specific task by ID.",
            produces: {
                application/json
            },
            parameters: [
                {
                    in: path,
                    name: id,
                    required: true,
                    description: "ID of the task to update.",
                    schema: {
                        type: string
                    }
                }
            ],
            responses: {
                204: {
                    description: Task deleted,
                    content: {
                        application/json: {
                            schema: {
                                $ref: "#/components/schemas/TaskResponse"
                            }
                        }
                    }
                },
                400: {
                    description: Bad request
                },
                404: {
                    description: Task not found
                }
            }
        }
    }
 */
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