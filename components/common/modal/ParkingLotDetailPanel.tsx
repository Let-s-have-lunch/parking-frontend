import React, { useEffect, useState } from "react";
import { ParkingLot } from "@/types/parking";
import favoriteApi from "@/api/general/favoriteApi";

interface Props {
    parkingLot: ParkingLot | null;
    isLoading: boolean;
    onClose: () => void;
}

export default function ParkingLotDetailPanel({ parkingLot, isLoading, onClose }: Props) {
    if (!parkingLot && !isLoading) return null;

    const [isFavorite, setIsFavorite] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    useEffect(() => {
        if (parkingLot) {
            setIsFavorite(parkingLot.favorite || false);
        }
    }, [parkingLot]);

    const handleToggleFavorite = async () => {
        if (!parkingLot || isToggling) return;

        setIsToggling(true);
        const previousState = isFavorite;
        setIsFavorite(!previousState);

        try {
            const newFavoriteStatus = await favoriteApi.toggleFavorite(parkingLot.id);
            setIsFavorite(newFavoriteStatus);
        } catch (error) {
            console.error("즐겨찾기 토글 실패:", error);
            setIsFavorite(previousState);
            alert("즐겨찾기 처리에 실패했습니다. 로그인이 필요할 수 있습니다.");
        } finally {
            setIsToggling(false);
        }
    };

    if (!parkingLot && !isLoading) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col max-h-[85vh] bg-white shadow-2xl rounded-t-3xl md:w-96 md:bottom-5 md:left-5 md:rounded-2xl md:max-h-[85vh] transition-transform">
            {/* 헤더 영역 */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 truncate pr-4">
                    {isLoading ? "불러오는 중..." : parkingLot?.name}
                </h2>
                <div className="flex items-center gap-2">
                    {!isLoading && parkingLot && (
                        <button
                            onClick={handleToggleFavorite}
                            disabled={isToggling}
                            className="flex items-center justify-center w-8 h-8 text-lg bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50">
                            {isFavorite ? (
                                <span className="text-yellow-400">★</span>
                            ) : (
                                <span className="text-gray-400">☆</span>
                            )}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-8 h-8 text-gray-400 bg-gray-100 rounded-full hover:bg-gray-200">
                        ✕
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-10">
                    <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
            ) : (
                parkingLot && (
                    <div className="p-5 pb-24 overflow-y-auto">
                        {/* 실시간 잔여 면수 및 혼잡도 영역 */}
                        {parkingLot.hasRealtimeData && (
                            <div className="flex items-center justify-between p-4 mb-6 bg-blue-50 rounded-xl">
                                <div>
                                    <p className="text-sm font-medium text-blue-600">
                                        실시간 잔여 주차면
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-3xl font-black text-blue-700">
                                            {parkingLot.currentAvailableSpots ?? "?"}{" "}
                                            <span className="text-lg font-normal text-blue-600">
                                                대
                                            </span>
                                        </p>
                                        {/* 혼잡도 뱃지 */}
                                        {parkingLot.congestionLevel === "CROWDED" && (
                                            <span className="px-2 py-0.5 text-xs font-bold text-red-600 bg-red-100 rounded-md">
                                                혼잡
                                            </span>
                                        )}
                                        {parkingLot.congestionLevel === "NORMAL" && (
                                            <span className="px-2 py-0.5 text-xs font-bold text-blue-600 bg-blue-100 rounded-md">
                                                보통
                                            </span>
                                        )}
                                        {parkingLot.congestionLevel === "SPACIOUS" && (
                                            <span className="px-2 py-0.5 text-xs font-bold text-green-600 bg-green-100 rounded-md">
                                                여유
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">총 주차면수</p>
                                    <p className="font-semibold text-gray-700">
                                        {parkingLot.capacity ?? "?"}대
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* 주차장 기본 정보 태그 */}
                        <div className="flex gap-2 mb-6">
                            {parkingLot.parkingLotSe && (
                                <span className="px-2 py-1 text-xs text-indigo-700 bg-indigo-100 rounded-md">
                                    {parkingLot.parkingLotSe}
                                </span>
                            )}
                            {parkingLot.parkingLotType && (
                                <span className="px-2 py-1 text-xs text-teal-700 bg-teal-100 rounded-md">
                                    {parkingLot.parkingLotType}
                                </span>
                            )}
                        </div>

                        {/* 상세 정보 리스트 */}
                        <div className="space-y-4 text-sm">
                            <InfoRow
                                label="주소"
                                value={parkingLot.roadAddress || parkingLot.landAddress}
                            />
                            <InfoRow
                                label="운영시간"
                                value={
                                    parkingLot.operDay
                                        ? `${parkingLot.operDay} (${parkingLot.weekdayOperOpen || ""} ~ ${parkingLot.weekdayOperClose || ""})`
                                        : null
                                }
                            />
                            <InfoRow
                                label="요금 안내"
                                value={
                                    parkingLot.parkingChargeInfo === "무료"
                                        ? "무료"
                                        : parkingLot.basicCharge && parkingLot.basicTime
                                          ? `기본 ${parkingLot.basicTime}분 ${parkingLot.basicCharge}원`
                                          : null
                                }
                            />
                            {parkingLot.addUnitTime && parkingLot.addUnitCharge && (
                                <InfoRow
                                    label="추가 요금"
                                    value={`${parkingLot.addUnitTime}분당 ${parkingLot.addUnitCharge}원`}
                                />
                            )}
                            <InfoRow
                                label="일일 주차"
                                value={
                                    parkingLot.dayTicketCharge
                                        ? `${parkingLot.dayTicketCharge}원`
                                        : null
                                }
                            />
                            <InfoRow
                                label="월 정기권"
                                value={
                                    parkingLot.monthTicketCharge
                                        ? `${parkingLot.monthTicketCharge}원`
                                        : null
                                }
                            />
                            <InfoRow label="결제 방법" value={parkingLot.paymentMethod} />
                            <InfoRow label="관리 기관" value={parkingLot.institutionNm} />
                            <InfoRow label="전화번호" value={parkingLot.phoneNumber} />
                            <InfoRow label="특기사항" value={parkingLot.spcmnt} />
                        </div>
                    </div>
                )
            )}
        </div>
    );
}

const InfoRow = ({ label, value }: { label: string; value: string | null | undefined }) => {
    if (!value || value === "" || value === "null") return null;
    return (
        <div className="flex border-b border-gray-100 pb-2 border-dashed">
            <span className="w-24 text-gray-500 shrink-0">{label}</span>
            <span className="font-medium text-gray-800 break-words">{value}</span>
        </div>
    );
};
