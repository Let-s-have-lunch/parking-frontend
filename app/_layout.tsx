import "../styles/global.css";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <StatusBar style={"light"} />
            <SafeAreaView className={"flex-1"}>
                <Slot />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
