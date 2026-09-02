import { ActivityIndicator, View, Text } from "react-native";
import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { BoundsParams, ParkingLot } from "@/types/parking";
import KakaoMap from "../../components/common/map/KakaoMap";
import parkingApi from "@/api/general/parkingApi";
import ParkingLotDetailPanel from "@/components/common/modal/ParkingLotDetailPanel";
import { useLocalSearchParams } from "expo-router";

export default function MapScreen() {
    const { targetLat, targetLng, targetLotId } = useLocalSearchParams();
    const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
    const [initialLocation, setInitialLocation] = useState<{ lat: number; lng: number } | null>(
        null,
    );

    useEffect(() => {
        if (targetLat && targetLng && targetLotId) {
            // 1. 지도 중심을 targetLat, targetLng로 이동
            setInitialLocation({ lat: Number(targetLat), lng: Number(targetLng) });
            // 2. 전달받은 주차장 아이디를 세팅하여 바텀 시트 오픈
            setSelectedLotId(Number(targetLotId));
        }
    }, [targetLat, targetLng, targetLotId]);

    const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
    const [selectedLotData, setSelectedLotData] = useState<ParkingLot | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchLocation = async (): Promise<void> => {
            try {
                // 1. 권한 요청
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== "granted") {
                    console.warn("위치 권한 거부. 기본 위치(제주시청)로 설정합니다.");
                    if (isMounted) setInitialLocation({ lat: 37.5666, lng: 126.9782 });
                    return;
                }

                // 2. 현재 위치 가져오기
                const location = await Location.getCurrentPositionAsync({});

                if (isMounted) {
                    setInitialLocation({
                        lat: location.coords.latitude,
                        lng: location.coords.longitude,
                    });
                }
            } catch (error) {
                console.error("위치 가져오기 오류:", error);
                if (isMounted) setInitialLocation({ lat: 33.5104, lng: 126.5222 });
            }
        };

        // 호출 (Promise unhandled rejection 방지)
        fetchLocation().catch(console.error);

        return () => {
            isMounted = false; // 컴포넌트 언마운트 시 상태 업데이트 방지 (메모리 누수 해결)
        };
    }, []);

    const handleBoundsChanged = useCallback(async (bounds: BoundsParams): Promise<void> => {
        try {
            const lots = await parkingApi.getParkingLotsInBounds(bounds);
            setParkingLots(lots);
        } catch (error) {
            console.error("주차장 데이터 로딩 실패:", error);
        }
    }, []);

    // 💡 마커 클릭 핸들러도 동일하게 처리
    const handleMarkerClick = useCallback((id: number) => {
        setSelectedLotId(id);
    }, []);

    useEffect(() => {
        // ID가 없으면 초기화 후 종료
        if (selectedLotId === null) {
            setSelectedLotData(null);
            return;
        }

        let isMounted = true; // ✅ 레이스 컨디션 및 언마운트 시 상태 업데이트 방지

        const loadData = async () => {
            setIsLoading(true);
            try {
                const response = await parkingApi.getParkingLotDetail(selectedLotId);

                // ✅ 컴포넌트가 마운트되어 있고, 현재 선택된 마커가 맞을 때만 상태 업데이트
                if (isMounted) {
                    setSelectedLotData(response);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("데이터 로드 실패", error);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadData().then(() => {});

        return () => {
            isMounted = false;
        };
    }, [selectedLotId]);

    if (!initialLocation) {
        return (
            <View className="flex-1 bg-brand-surface items-center justify-center">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="mt-4 font-pretendard text-secondary-main text-sm">
                    현재 위치를 찾고 있습니다...
                </Text>
            </View>
        );
    }

    const validLocation = initialLocation as { lat: number; lng: number };

    return (
        <View className="flex-1 bg-brand-surface">
            <KakaoMap
                parkingLots={parkingLots}
                onBoundsChanged={handleBoundsChanged}
                onMarkerClick={handleMarkerClick}
                initialLocation={validLocation}
            />

            {selectedLotId !== null && (
                <ParkingLotDetailPanel
                    parkingLot={selectedLotData}
                    isLoading={isLoading}
                    onClose={() => setSelectedLotId(null)}
                />
            )}
        </View>
    );
}
