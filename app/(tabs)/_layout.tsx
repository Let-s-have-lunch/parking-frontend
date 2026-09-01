import { Tabs } from "expo-router";
import MainHeader from "@/components/layout/MainHeader";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                header: () => <MainHeader />,
                tabBarActiveTintColor: "#2563EB",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 10,
                    paddingTop: 5,
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
                    title: "마이페이지",
                    tabBarIcon: ({ color }) => <Ionicons name="star" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}

export default TabLayout;
