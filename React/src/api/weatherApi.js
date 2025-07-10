import apiClient from "@api/apiClient.js";

export const fetchWeather = ({lat, lon}) => {
    return apiClient.get("/api/dashboard/weather", { params: { lat, lon } });
};