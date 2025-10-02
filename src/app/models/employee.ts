export type employee = {
    id: string;
    name: string;
    email: string;
    role: string;
    available: boolean;
}

export type getEmployeeResponse = {
    code: number;
    message: string;
    data: employee[];
}