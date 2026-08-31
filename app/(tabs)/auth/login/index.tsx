import React, { useState } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Href, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/common/button/Button";
import { useUserStore } from "@/stores/user/useUserStore";
import userApi from "@/api/general/userApi";
import { loginUserSchema, LoginUserInputType } from "@/schemas/user/loginUserSchema";
import InputGroup from "@/components/common/input/InputGroup";

export default function LoginScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const { login } = useUserStore();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginUserInputType>({
        resolver: zodResolver(loginUserSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginUserInputType) => {
        try {
            setIsLoading(true);
            setServerError("");

            const { user, token } = await userApi.loginUser(data);
            await login(user, token);

            router.replace({ pathname: "/" });
        } catch (error: any) {
            console.error("로그인 에러:", error);
            setServerError(error.response?.data?.message || "로그인에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
                className="px-5">
                <View className="mb-10">
                    <Text className="text-3xl font-pretendard-bold text-text-primary">
                        환영합니다!
                    </Text>
                    <Text className="text-base font-pretendard text-text-secondary mt-2">
                        주차장 맵 서비스를 이용하기 위해 로그인해주세요.
                    </Text>
                </View>

                {/* 💡 Controller를 사용해 InputGroup과 연결 */}
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <InputGroup
                            label="이메일"
                            placeholder="이메일을 입력해주세요"
                            value={value}
                            onChangeText={onChange}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            errorMessage={errors.email?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <InputGroup
                            label="비밀번호"
                            placeholder="비밀번호를 입력해주세요"
                            value={value}
                            onChangeText={onChange}
                            isPassword={true}
                            errorMessage={errors.password?.message || serverError} // 폼 에러 또는 서버 에러 표시
                        />
                    )}
                />

                {serverError ? (
                    <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <Text className="text-red-500 text-sm font-pretendard text-center">
                            {serverError}
                        </Text>
                    </View>
                ) : null}

                <Button
                    className="mt-10 py-4"
                    onPress={handleSubmit(onSubmit)}
                    isLoading={isLoading}>
                    로그인
                </Button>

                <View className="mt-6 flex-row justify-center items-center">
                    <Text className="font-pretendard text-text-secondary text-sm">
                        아직 계정이 없으신가요?
                    </Text>
                    <TouchableOpacity
                        className="ml-2"
                        onPress={() => router.push("/auth/signup" as Href)}
                        activeOpacity={0.7}>
                        <Text className="font-pretendard-semibold text-primary-main text-sm underline">
                            회원가입
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
