export type feedback = {
    id: string;
    user_id: string;
    user_name: string;
    message: string;
    created_at: string;
    room_num: number;
    booking_id: string;
    rating: number;
}

export type getFeedbackResponse = {
    code: number;
    message: string;
    data: feedback[];
}