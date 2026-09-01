import api from "@/api/axiosInstance";
import { ParkingLot } from "@/types/parking";

export interface ToggleFavoriteResponse {
    success: boolean;
    isFavorite: boolean;
    message: string;
}

export interface GetFavoritesResponse {
    success: boolean;
    data: ParkingLot[];
    totalCount: number;
}

const toggleFavorite = async (parkingLotId: number): Promise<boolean> => {
    const response = await api.post<ToggleFavoriteResponse>(`/favorites/${parkingLotId}`);
    return response.data.isFavorite;
};

const getMyFavorites = async (): Promise<ParkingLot[]> => {
    const response = await api.get<GetFavoritesResponse>("/favorites");
    return response.data.data;
};

export default {
    toggleFavorite,
    getMyFavorites,
};
