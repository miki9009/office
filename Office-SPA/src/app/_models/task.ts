
export interface Task {
    id: number;
    workerId: number;
    title: string;
    description: string;
    dateAdded: Date;
    deadline: Date;
    time: string;
    orderingPersonId: number;
    priority: number;
    state: number;
    OfficeID: number;
}



