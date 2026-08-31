import api from "@/api/axiosInstance";
import { LoginResponse, User } from "@/types/user";
import { LoginUserInputType } from "@/schemas/user/loginUserSchema";
import { RegisterUserInputType } from "@/schemas/user/registerUserSchema";

const registerUser = async (data: RegisterUserInputType): Promise<User> => {
    const response = await api.post("/auth/signup", data);
    return response.data.data;
};

const loginUser = async (data: LoginUserInputType): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data.data;
};

const getMe = async (): Promise<User> => {
    const response = await api.get("/users/me");
    return response.data.data;
};

export default {
    registerUser,
    loginUser,
    getMe,
};
