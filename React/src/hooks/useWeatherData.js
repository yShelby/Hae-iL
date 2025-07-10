// 사용자의 위치 좌표를 기반으로 날씨 데이터를 관리하는 커스텀 훅
import {useQuery} from "@tanstack/react-query";
import {fetchWeather} from "@api/weatherApi.js";

export const useWeatherData = (coords) => {
    const latitude = coords?.latitude;
    const longitude = coords?.longitude;

    return useQuery({
        queryKey: ["weather", latitude, longitude],
        queryFn: () => fetchWeather({ lat:  latitude, lon: longitude }),
        enabled: !!latitude && !!longitude,
        staleTime: 1000 * 60 * 10, // 10분(캐시된 데이터를 "유효한 상태"로 간주하는 시간
    });
};