// /schemas/user/registerUserSchema.ts
import { z } from "zod";

export const registerUserSchema = z
    .object({
        email: z.email("유효한 이메일 주소를 입력해주세요."),
        nickname: z.string().min(2, "닉네임은 2자 이상 입력해주세요."),
        password: z.string().min(6, "비밀번호는 6자 이상 입력해주세요."),
        confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
    })
    .refine(data => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "비밀번호가 일치하지 않습니다.",
    });

export type RegisterUserInputType = z.infer<typeof registerUserSchema>;
