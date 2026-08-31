export interface User {
    id: number;
    email: string;
    nickname: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}
