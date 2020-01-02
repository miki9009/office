
export interface Worker {
    id: number;
    name: string;
    surname: string;
    supervisor: string;
    checkedIn: boolean;
    userID: number;
    jobPosition: string;
    lastLogin: Date;
    OfficeID: number;
}

export interface WorkerCreate {
    name: string;
    surname: string;
    supervisor: string;
    checkdIn: boolean;
    password: string;
    email: string;
    username: string;
    OfficeID: number;
}
