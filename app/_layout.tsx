import "../styles/global.css";

import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";

SplashScreen.preventAutoHideAsync().then(() => {});

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
