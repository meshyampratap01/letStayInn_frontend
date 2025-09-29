export type loginResponse = {
    code: number;
    message: string;
    data: {
        token: string;
    };
};

export type payload = {
    user_id:string,
    username:string,
    role:string
}
