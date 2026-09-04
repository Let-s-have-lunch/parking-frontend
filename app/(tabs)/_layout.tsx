import { Tabs } from "expo-router";
import MainHeader from "@/components/layout/MainHeader";
import { Ionicons } from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                header: () => <MainHeader />,
                tabBarActiveTintColor: "#2563EB",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarStyle: {
                    // 고정 높이를 덮어쓰거나 safe area 하단 여백을 더해줍니다.
                    height: "auto",
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
                    paddingTop: 6,
                    backgroundColor: "#FFFFFF",
                },
                tabBarLabelStyle: {
                    fontFamily: "pretendard-medium",
                    fontSize: 12,
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "지도",
                    tabBarIcon: ({ color }) => <Ionicons name="map" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="favorite/index"
                options={{
                    title: "즐겨찾기",
                    tabBarIcon: ({ color }) => <Ionicons name="star" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="my/index"
                options={{
                    title: "마이",
                    tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="auth/login/index"
                options={{
                    href: null,
                    title: "로그인",
                }}
            />
            <Tabs.Screen
                name="auth/signup/index"
                options={{
                    href: null,
                    title: "회원가입",
                }}
            />
        </Tabs>
    );
}
