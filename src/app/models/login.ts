export type loginResponse = {
    code: number;
    message: string;
    data: {
        token: string;
    };
};

export type payload = {
    id:string,
    name:string,
    role:string
}
