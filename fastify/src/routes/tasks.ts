import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Task } from '../models/task';

const router = Router();
let tasks: Task[] = [];

const taskValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('completed').isBoolean().withMessage('Completed must be a boolean'),
];

/**
 * @swagger
 * components: {
 *   schemas: {
        TaskRequest: {
            type: object,
            properties: {
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
            }
        }
    }
 }
 */

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
router.post('/', taskValidationRules, (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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
 * /tasks:
 *  get:
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
router.get('/', (req: Request, res: Response) => {
    res.json(tasks);
});

/**
 * @swagger
 * /tasks/{id}:
 *  get:
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
 */
router.get('/:id', (req: Request, res: Response) => {
    const task = tasks.find((t) => t.id === parseInt(req.params.id));

    if (!task) {
        res.status(404).send('Task not found');
    } else {
        res.json(task);
    }
});

router.put('/:id', taskValidationRules, (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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
        res.status(404).send('Task not found');
    } else {
        tasks.splice(index, 1);
        res.status(204).send();
    }
});

export default router;