/**
 * @swagger
 * components: {
 *   schemas: {
        TaskRequest: {
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

export interface TaskRequest {
    title: string;
    description: string;
    completed: boolean;
}

export interface TaskResponse extends TaskRequest {
    id: number;
}

export interface Task extends TaskResponse {
}