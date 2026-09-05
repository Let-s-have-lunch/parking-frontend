import { useRef, useEffect, useMemo } from "react";
import { View } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import { ParkingLot, BoundsParams } from "@/types/parking";

export interface KakaoMapProps {
    parkingLots: ParkingLot[];
    onBoundsChanged: (bounds: BoundsParams) => void;
    initialLocation: { lat: number; lng: number };
    onMarkerClick: (id: number) => void;
}

const NativeWebView = WebView as any;
const KAKAO_JS_KEY = process.env.EXPO_PUBLIC_KAKAO_APP_KEY || "";

export default function KakaoMap({
    parkingLots,
    onBoundsChanged,
    initialLocation,
    onMarkerClick,
}: KakaoMapProps) {
    const webviewRef = useRef<any>(null);

    useEffect(() => {
        if (webviewRef.current) {
            const script = `if(window.updateMarkers) { window.updateMarkers(${JSON.stringify(parkingLots)}); } true;`;
            webviewRef.current.injectJavaScript(script);
        }
    }, [parkingLots]);

    // 💡 initialLocation이 바뀔 때만 HTML 템플릿 재생성
    const htmlSource = useMemo(() => {
        const template = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=clusterer"></script>
                <style>
                    body { margin: 0; padding: 0; overflow: hidden; }
                    #map { width: 100vw; height: 100vh; }
                </style>
            </head>
            <body>
                <div id="map"></div>
                <script>
                    let map, clusterer;
                    
                    function initMap() {
                        const container = document.getElementById('map');
                        const options = { 
                            center: new kakao.maps.LatLng(${initialLocation.lat}, ${initialLocation.lng}),
                            level: 5,
                            draggable: true,
                            scrollwheel: true
                        };
                        map = new kakao.maps.Map(container, options);

                        clusterer = new kakao.maps.MarkerClusterer({
                            map: map, 
                            averageCenter: true, 
                            minLevel: 6, 
                            disableClickZoom: true
                        });

                        kakao.maps.event.addListener(map, 'idle', function() {
                            sendBounds();
                        });
                    }

                    function sendBounds() {
                        const bounds = map.getBounds();
                        const sw = bounds.getSouthWest();
                        const ne = bounds.getNorthEast();

                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'BOUNDS_CHANGED',
                            data: { swLat: sw.getLat(), swLng: sw.getLng(), neLat: ne.getLat(), neLng: ne.getLng() }
                        }));
                    }

                    window.updateMarkers = function(lots) {
                        clusterer.clear(); 
                        const newMarkers = lots.map(function(lot) {
                            const marker = new kakao.maps.Marker({
                                position: new kakao.maps.LatLng(lot.latitude, lot.longitude),
                                title: lot.name
                            });
                            
                            kakao.maps.event.addListener(marker, 'click', function() {
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    type: 'MARKER_CLICK',
                                    data: lot.id
                                }));
                            });
                            return marker;
                        });
                        clusterer.addMarkers(newMarkers);
                    };
                    window.onload = initMap;
                </script>
            </body>
            </html>
        `;
        return { html: template };
    }, [initialLocation.lat, initialLocation.lng]);

    const handleMessage = (event: WebViewMessageEvent) => {
        try {
            const message = JSON.parse(event.nativeEvent.data);
            if (message.type === "BOUNDS_CHANGED") {
                onBoundsChanged(message.data);
            } else if (message.type === "MARKER_CLICK") {
                onMarkerClick(message.data);
            }
        } catch (error) {
            console.error("메시지 파싱 실패:", error);
        }
    };

    return (
        <View className="flex-1 bg-brand-surface">
            <NativeWebView
                ref={webviewRef}
                originWhitelist={["*"]}
                source={htmlSource}
                onMessage={handleMessage}
                javaScriptEnabled={true}
                bounces={false}
                scrollEnabled={false}
            />
        </View>
    );
}
