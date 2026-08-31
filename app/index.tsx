import { ActivityIndicator, View } from "react-native";

function RootPage() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <ActivityIndicator size="large" color="#2288ED" />
        </View>
    );
}

export default RootPage;
