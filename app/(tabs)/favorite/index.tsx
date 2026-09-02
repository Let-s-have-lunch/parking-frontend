import { useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect, Redirect, Href } from "expo-router";
import favoriteApi from "@/api/general/favoriteApi";
import { ParkingLot } from "@/types/parking";
import { useUserStore } from "@/stores/user/useUserStore";

export default function FavoriteScreen() {
    const { isLoggedIn, user, logout } = useUserStore();

    if (!isLoggedIn) {
        return <Redirect href={"/auth/login" as Href} />;
    }

    const router = useRouter();
    const [favorites, setFavorites] = useState<ParkingLot[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 화면이 포커스될 때마다(탭 진입 시) 최신 즐겨찾기 목록을 불러옵니다.
    useFocusEffect(
        useCallback(() => {
            let isMounted = true;

            const fetchFavorites = async () => {
                setIsLoading(true);
                try {
                    const data = await favoriteApi.getMyFavorites();
                    if (isMounted) {
                        // 불러온 목록은 모두 내 즐겨찾기이므로 isFavorite를 true로 강제 세팅합니다.
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

            fetchFavorites().then(() => {});

            return () => {
                isMounted = false;
            };
        }, []),
    );

    // 검색어에 따른 필터링 (프론트엔드 단독 처리)
    const filteredFavorites = favorites.filter(lot => lot.name.includes(searchQuery));

    // 즐겨찾기 토글 (실수 방지를 위해 목록에서 즉시 삭제하지 않고 별 모양만 바꿈)
    const handleToggleFavorite = async (id: number) => {
        // 낙관적 업데이트: UI 먼저 변경
        setFavorites(prev =>
            prev.map(lot => (lot.id === id ? { ...lot, favorite: !lot.favorite } : lot)),
        );

        try {
            const newStatus = await favoriteApi.toggleFavorite(id);
            // API 응답으로 최종 상태 확정
            setFavorites(prev =>
                prev.map(lot => (lot.id === id ? { ...lot, isFavorite: newStatus } : lot)),
            );
        } catch (error) {
            console.error("즐겨찾기 상태 변경 실패:", error);
            // 실패 시 롤백
            setFavorites(prev =>
                prev.map(lot => (lot.id === id ? { ...lot, isFavorite: !lot.favorite } : lot)),
            );
        }
    };

    // 주차장 항목 클릭 시 지도 탭으로 이동하며 파라미터 전달
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

    // FlatList의 각 아이템 렌더링 함수
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
                {/* 실시간 잔여면수가 있다면 작게 표시 */}
                {item.hasRealtimeData && (
                    <Text className="mt-2 text-xs font-medium text-blue-600">
                        실시간 잔여: {item.currentAvailableSpots ?? "?"}대
                    </Text>
                )}
            </View>

            {/* 토글 버튼 (버튼 터치 시 행 전체 클릭 이벤트를 막기 위해 뷰로 감싸거나 hitSlop 적용) */}
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
            {/* 상단 검색 영역 */}
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

            {/* 목록 영역 */}
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
