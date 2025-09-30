export type getRoomResponse = {
    code: number;
    message: string;
    data: room[];
}

export type room = {
    number: number;
    type: string;
    price: number;
    is_available: boolean;
    description: string;
}

