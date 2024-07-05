/** Task schema Info */
export interface TaskRequest {
    /**
     * Task title
     * @example Call John Doe
     */
    title: string;

    /**
     * Task description
     * @example A note to call John Doe
     */
    description: string;
    
    /**
     * Task completion status
     * @example false
     */ 
    completed: boolean;
}

/** Task schema Info */
export interface TaskResponse extends TaskRequest {
    /**
     * Task identifier
     * @example 1
     */
    id: number;
}

export interface Task extends TaskResponse {
}