export type svcRequest = {
    service_request_id: string;
    id: string
    user_id: string;
    room_num: number;
    type: string;
    details: string;
    created_at: string;
    is_assigned: boolean;
    status: string;
    EmployeeID: string;
}

export type svcRequestResponse = {
    code: number;
    message: string;
    data: svcRequest[];
}