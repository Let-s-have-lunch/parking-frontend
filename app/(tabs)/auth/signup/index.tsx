import { useState } from "react";
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
import userApi from "@/api/general/userApi";
import { registerUserSchema, RegisterUserInputType } from "@/schemas/user/registerUserSchema";
import InputGroup from "@/components/common/input/InputGroup";
import Alert from "@/utils/alert/alert";

export default function SignupScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterUserInputType>({
        resolver: zodResolver(registerUserSchema),
        defaultValues: {
            email: "",
            nickname: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegisterUserInputType) => {
        try {
            setIsLoading(true);
            setServerError("");

            await userApi.registerUser(data);

            Alert.alert({
                title: "회원가입 성공",
                message: "가입이 완료되었습니다. 로그인해주세요.",
                onConfirm: () => router.push("/auth/login" as Href),
            });
        } catch (error: any) {
            console.error("회원가입 에러:", error);
            setServerError(error.response?.data?.message || "회원가입에 실패했습니다.");
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
                className="px-5 py-10">
                <View className="mb-10">
                    <Text className="text-3xl font-pretendard-bold text-text-primary">
                        계정 만들기
                    </Text>
                    <Text className="text-base font-pretendard text-text-secondary mt-2">
                        필요한 정보를 입력하고 서비스를 시작해보세요.
                    </Text>
                </View>

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
                    name="nickname"
                    render={({ field: { onChange, value } }) => (
                        <InputGroup
                            label="닉네임"
                            placeholder="사용하실 닉네임을 입력해주세요"
                            value={value}
                            onChangeText={onChange}
                            autoCapitalize="none"
                            errorMessage={errors.nickname?.message}
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
                            errorMessage={errors.password?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, value } }) => (
                        <InputGroup
                            label="비밀번호 확인"
                            placeholder="비밀번호를 한 번 더 입력해주세요"
                            value={value}
                            onChangeText={onChange}
                            isPassword={true}
                            errorMessage={errors.confirmPassword?.message || serverError}
                        />
                    )}
                />

                <Button
                    className="mt-10 py-4"
                    onPress={handleSubmit(onSubmit)}
                    isLoading={isLoading}>
                    가입하기
                </Button>

                <View className="mt-6 flex-row justify-center items-center">
                    <Text className="font-pretendard text-text-secondary text-sm">
                        이미 계정이 있으신가요?
                    </Text>
                    <TouchableOpacity
                        className="ml-2"
                        onPress={() => router.push("/auth/login" as Href)}
                        activeOpacity={0.7}>
                        <Text className="font-pretendard-semibold text-primary-main text-sm underline">
                            로그인
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
