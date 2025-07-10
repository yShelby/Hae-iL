import {useEffect, useState} from "react";
import {useWeatherData} from "@/hooks/useWeatherData.js";

const Weather = () => {
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
                setCoords({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (e) => {
                console.error("Geolocation error: ", e);
                // ⚠️ 사용자 위치 정보 획득 실패 시, 기본 좌표 (서울) 설정
                setCoords({ latitude: 37.5665, longitude: 126.9780 });
            }
        );
    }, []);

    const {data: weatherResponse, isLoading, isError} = useWeatherData(coords);

    if (isLoading) return <div className={"weather-loading"}>날씨 정보 로딩 중...</div>;
    if (isError) return <div className={"weather-error"}>날씨를 가져올 수 없어요.</div>;

    const weatherData = weatherResponse?.data;

    return (
        <div className={"weather-container"}>
            <h3>오늘의 날씨</h3>
            {weatherData ? (
                <div className="weather-content">
                    <img
                        src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                        alt={weatherData.description}
                        className="weather-icon"
                    />
                    <p className="weather-temp">
                        {weatherData?.temp != null
                            // Number()로 확실히 숫자 변환 후 toFixed(1)로 소수점 첫째 자리까지 포맷팅
                            ? Number(weatherData.temp).toFixed(1) + '°C'
                            : '온도 정보 없음'}
                    </p>
                    <p className="weather-desc">{weatherData.description}</p>
                </div>
            ) : (
                <p>날씨 정보가 없습니다.</p>
            )}
        < /div>
    );
};
export default Weather;