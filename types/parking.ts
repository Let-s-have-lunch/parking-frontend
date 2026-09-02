export type CongestionLevel = "SPACIOUS" | "NORMAL" | "CROWDED" | "UNKNOWN";

export interface ParkingLot {
    // --- 기본 정보 ---
    id: number;
    parkingLotNo: string;
    name: string;
    parkingLotSe: string | null; // 공영/민영 등
    parkingLotType: string | null; // 노상/노외 등
    roadAddress: string | null;
    landAddress: string | null;
    latitude: number;
    longitude: number;
    capacity: number | null; // 총 주차면 (기존 totalCapacity -> capacity)

    // --- 운영 정보 ---
    feedingSe: string | null;
    enforceSe: string | null;
    operDay: string | null; // 운영요일 (예: 평일+토요일+공휴일)
    weekdayOperOpen: string | null;
    weekdayOperClose: string | null;
    satOperOpen: string | null;
    satOperClose: string | null;
    holidayOperOpen: string | null;
    holidayOperClose: string | null;

    // --- 요금 정보 ---
    parkingChargeInfo: string | null; // 유료/무료
    basicTime: string | null; // 타입 에러 방지를 위해 string 혼용 허용
    basicCharge: string | null;
    addUnitTime: string | null;
    addUnitCharge: string | null;
    dayTicketAdjTime: string | null;
    dayTicketCharge: string | null;
    monthTicketCharge: string | null;
    paymentMethod: string | null;

    // --- 부가 정보 ---
    spcmnt: string | null; // 특기사항
    institutionNm: string | null; // 관리기관명
    phoneNumber: string | null; // 전화번호
    pwdbsPpkZoneYn: string | null; // 장애인 구역 여부

    // --- 실시간 연동 정보 ---
    hasRealtimeData: boolean; // 백엔드의 isRealtimeSupported
    currentAvailableSpots: number | null;
    congestionLevel: CongestionLevel;

    favorite: boolean;
}

export interface ParkingLotsResponse {
    success: boolean;
    data: ParkingLot[];
    totalCount: number;
}

export interface ParkingLotResponse {
    success: boolean;
    data: ParkingLot;
}

export interface BoundsParams {
    swLat: number;
    neLat: number;
    swLng: number;
    neLng: number;
}
