import {useEffect, useState} from "react";
import {useWeatherData} from "@/hooks/useWeatherData.js";
import "./css/Weather.css";

// 영문 날씨 상태를 한글로 변환하기 위한 객체
const WEATHER_IN_KOREAN = {
    Clear: '맑음',
    Clouds: '구름 많음',
    Rain: '비',
    Snow: '눈',
    Drizzle: '이슬비',
    Thunderstorm: '천둥번개',
    Mist: '안개',
    Smoke: '연기',
    Haze: '실안개',
    Dust: '먼지',
    Fog: '짙은 안개',
    Sand: '황사',
    Ash: '화산재',
    Squall: '돌풍',
    Tornado: '토네이도'
};

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
            {weatherData ? (
                <>
                    {/* 1. 도시 (시/구/동) */}
                    <div className="weather-location">
                        {weatherData.city}
                    </div>

                    <div className="weather-content">
                        {/* 2. 날씨 아이콘 */}
                        <img
                            src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                            alt={weatherData.main}
                            className="weather-icon"
                        />
                        <div className="weather-details">
                            {/* 3. 날씨 내용 (main) */}
                            <p className="weather-main-text">
                                {WEATHER_IN_KOREAN[weatherData.main] || weatherData.main}
                            </p>
                            {/* 4. 현재 온도 */}
                            <p className="weather-temp-current">
                                {Math.round(weatherData.temp)}°C
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                <p>날씨 정보가 없습니다.</p>
            )}
        </div>
    );
};

export default Weather;