import api from "@/api/axiosInstance";
import { ParkingLot, BoundsParams, ParkingLotsResponse, ParkingLotResponse } from "@/types/parking";

const getParkingLotsInBounds = async (params: BoundsParams): Promise<ParkingLot[]> => {
    const response = await api.get<ParkingLotsResponse>("/parking-lots", { params });
    return response.data.data;
};

const getParkingLotDetail = async (id: number): Promise<ParkingLot> => {
    const response = await api.get<ParkingLotResponse>(`/parking-lots/${id}`);
    return response.data.data;
};

export default {
    getParkingLotsInBounds,
    getParkingLotDetail,
};
