import { z } from "zod";

export const loginUserSchema = z.object({
    email: z.email("유효한 이메일 주소를 입력해주세요."),
    password: z.string().min(1, "비밀번호를 입력해주세요."),
});
export type LoginUserInputType = z.infer<typeof loginUserSchema>;
