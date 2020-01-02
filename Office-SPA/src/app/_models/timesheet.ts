
export interface Timesheet {
    id: number;
    startDate: Date;
    endTime: Date;
    clockedOut: boolean;
    total: number;
    day: string;
    notes: string;
    controlSum: number;
    sum: number;
}
