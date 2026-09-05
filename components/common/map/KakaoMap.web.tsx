import { View, Text } from "react-native";
import { Map, MarkerClusterer, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { KakaoMapProps } from "./KakaoMap";

const KAKAO_JS_KEY = process.env.EXPO_PUBLIC_KAKAO_APP_KEY || "";

export default function KakaoMap({ parkingLots, onBoundsChanged, initialLocation, onMarkerClick }: KakaoMapProps) {
    const [loading, error] = useKakaoLoader({
        appkey: KAKAO_JS_KEY,
        libraries: ["clusterer"],
    });

    if (loading)
        return (
            <View className="flex-1 items-center justify-center">
                <Text>지도 로딩 중...</Text>
            </View>
        );
    if (error)
        return (
            <View className="flex-1 items-center justify-center">
                <Text>지도 로딩 실패</Text>
            </View>
        );

    return (
        <Map
            center={
                initialLocation
                    ? { lat: initialLocation.lat, lng: initialLocation.lng }
                    : { lat: 37.5665, lng: 126.978 }
            }
            style={{ width: "100%", height: "100%" }}
            level={5}
            // 💡 1. 지도가 처음 렌더링될 때 최초 1회 실행
            onCreate={map => {
                const bounds = map.getBounds();
                onBoundsChanged({
                    swLat: bounds.getSouthWest().getLat(),
                    swLng: bounds.getSouthWest().getLng(),
                    neLat: bounds.getNorthEast().getLat(),
                    neLng: bounds.getNorthEast().getLng(),
                });
            }}
            // 2. 지도를 움직인 후 멈출 때 실행 (기존과 동일)
            onIdle={map => {
                const bounds = map.getBounds();
                onBoundsChanged({
                    swLat: bounds.getSouthWest().getLat(),
                    swLng: bounds.getSouthWest().getLng(),
                    neLat: bounds.getNorthEast().getLat(),
                    neLng: bounds.getNorthEast().getLng(),
                });
            }}>
            <MarkerClusterer averageCenter={true} minLevel={6} disableClickZoom={true}>
                {parkingLots.map(lot => (
                    <MapMarker
                        key={lot.id}
                        position={{ lat: lot.latitude, lng: lot.longitude }}
                        title={lot.name}
                        onClick={() => onMarkerClick(lot.id)}
                    />
                ))}
            </MarkerClusterer>
        </Map>
    );
}
