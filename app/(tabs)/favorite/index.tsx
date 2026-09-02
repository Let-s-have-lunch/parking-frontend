import { useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect, Redirect, Href } from "expo-router";
import favoriteApi from "@/api/general/favoriteApi";
import { ParkingLot } from "@/types/parking";
import { useUserStore } from "@/stores/user/useUserStore";

export default function FavoriteScreen() {
    const { isLoggedIn, user, logout, isInitialized } = useUserStore();

    const router = useRouter();
    const [favorites, setFavorites] = useState<ParkingLot[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (!isLoggedIn) return;

            let isMounted = true;

            const fetchFavorites = async () => {
                setIsLoading(true);
                try {
                    const data = await favoriteApi.getMyFavorites();
                    if (isMounted) {
                        const initializedData: ParkingLot[] = data.map(lot => ({
                            ...lot,
                            favorite: true,
                        }));
                        setFavorites(initializedData);
                    }
                } catch (error) {
                    console.error("즐겨찾기 목록 로드 실패:", error);
                } finally {
                    if (isMounted) setIsLoading(false);
                }
            };

            fetchFavorites().then(() => {})

            return () => {
                isMounted = false;
            };
        }, [isLoggedIn]),
    );

    // 토큰 복구(초기화)가 완료될 때까지 로딩바를 보여주어 임시 튕김 현상 방지
    if (!isInitialized) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    // 초기화 완료 후에도 로그인이 안 되어 있다면 로그인 페이지로 이동
    if (!isLoggedIn) {
        return <Redirect href={"/auth/login" as Href} />;
    }

    const filteredFavorites = favorites.filter(lot => lot.name.includes(searchQuery));

    const handleToggleFavorite = async (id: number) => {
        setFavorites(prev =>
            prev.map(lot => (lot.id === id ? { ...lot, favorite: !lot.favorite } : lot)),
        );

        try {
            const newStatus = await favoriteApi.toggleFavorite(id);
            setFavorites(prev =>
                prev.map(lot => (lot.id === id ? { ...lot, isFavorite: newStatus } : lot)),
            );
        } catch (error) {
            console.error("즐겨찾기 상태 변경 실패:", error);
            setFavorites(prev =>
                prev.map(lot => (lot.id === id ? { ...lot, isFavorite: !lot.favorite } : lot)),
            );
        }
    };

    const handlePressItem = (lot: ParkingLot) => {
        router.navigate({
            pathname: "/",
            params: {
                targetLat: lot.latitude,
                targetLng: lot.longitude,
                targetLotId: lot.id,
            },
        });
    };

    const renderItem = ({ item }: { item: ParkingLot }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handlePressItem(item)}
            className="flex-row items-center justify-between p-4 mb-3 bg-white border border-gray-100 shadow-sm rounded-xl">
            <View className="flex-1 pr-4">
                <Text className="text-lg font-bold text-gray-800 truncate">{item.name}</Text>
                <Text className="mt-1 text-sm text-gray-500 truncate">
                    {item.roadAddress || item.landAddress || "주소 정보 없음"}
                </Text>
                {item.hasRealtimeData && (
                    <Text className="mt-2 text-xs font-medium text-blue-600">
                        실시간 잔여: {item.currentAvailableSpots ?? "?"}대
                    </Text>
                )}
            </View>

            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => handleToggleFavorite(item.id)}
                className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-full">
                {item.favorite ? (
                    <Text className="text-xl text-yellow-400">★</Text>
                ) : (
                    <Text className="text-xl text-gray-300">☆</Text>
                )}
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <View className="px-5 pt-10 pb-4 bg-white border-b border-gray-200 shadow-sm">
                <Text className="mb-4 text-2xl font-bold text-gray-800">즐겨찾는 주차장</Text>
                <View className="flex-row items-center px-4 py-3 bg-gray-100 rounded-lg">
                    <Text className="mr-2 text-gray-400">🔍</Text>
                    <TextInput
                        className="flex-1 text-base text-gray-800"
                        placeholder="주차장 이름을 검색하세요"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9ca3af"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <Text className="text-gray-400">✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#2563EB" />
                </View>
            ) : (
                <FlatList
                    data={filteredFavorites}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-20">
                            <Text className="text-gray-400">
                                {searchQuery
                                    ? "검색 결과가 없습니다."
                                    : "즐겨찾기한 주차장이 없습니다."}
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}
