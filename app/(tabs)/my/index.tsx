import { View, Text, ActivityIndicator } from "react-native";
import { Href, Redirect } from "expo-router";
import { useUserStore } from "@/stores/user/useUserStore";
import Button from "@/components/common/button/Button";

export default function MyPageScreen() {
    const { isLoggedIn, user, logout, isInitialized } = useUserStore();

    if (!isInitialized) {
        return (
            <View className="flex-1 items-center justify-center bg-brand-surface">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (!isLoggedIn) {
        return <Redirect href={"/auth/login" as Href} />;
    }

    return (
        <View className="flex-1 bg-brand-surface p-5">
            <View className="mb-8 mt-5 items-center">
                <View className="w-20 h-20 bg-primary-main rounded-full items-center justify-center mb-4">
                    <Text className="text-white text-2xl font-pretendard-bold">
                        {user?.nickname?.[0] || "U"}
                    </Text>
                </View>
                <Text className="text-lg font-pretendard-bold text-text-primary">
                    {user?.nickname} 님
                </Text>
                <Text className="text-sm font-pretendard text-text-secondary mt-1">
                    {user?.email}
                </Text>
            </View>

            <Button variant="outline" onPress={logout} className="py-4">
                로그아웃
            </Button>
        </View>
    );
}
