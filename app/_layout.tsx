import "../styles/global.css";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { useUserStore } from "@/stores/user/useUserStore";
import { useEffect } from "react";

export default function RootLayout() {
    const restoreLogin = useUserStore(state => state.restoreLogin);

    useEffect(() => {
        restoreLogin().then(() => {});
    }, [restoreLogin]);

    return (
        <SafeAreaProvider>
            <StatusBar style={"light"} />
            <SafeAreaView className={"flex-1"}>
                <Slot />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
