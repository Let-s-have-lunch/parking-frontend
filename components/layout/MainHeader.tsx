import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons"; // 임시 아이콘용

interface MainHeaderProps {
    title?: string;
    className?: string;
}

function MainHeader({ title = "주차장 맵", className }: MainHeaderProps) {
    return (
        <SafeAreaView
            edges={["top"]}
            className={twMerge("bg-white border-b border-divider", className)}>
            <View className="flex-row items-center justify-between px-5 py-4">
                <Text className="text-xl font-pretendard-bold text-text-primary">{title}</Text>
                {/* 💡 나중에 알림이나 유저 프로필 아이콘을 넣을 수 있는 자리 */}
                <Ionicons name="notifications-outline" size={24} color="#333" />
            </View>
        </SafeAreaView>
    );
}

export default MainHeader;
