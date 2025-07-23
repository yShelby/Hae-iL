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

    // if (isLoading) return <div className={"weather-loading"}>날씨 정보 로딩 중...</div>;
    // if (isError) return <div className={"weather-error"}>날씨를 가져올 수 없어요.</div>;
    //
    // const weatherData = weatherResponse?.data;

    return (
        <div className="weather-widget-container">
            <div className="weather-container">
                {isLoading && <div className="weather-message">날씨 정보 로딩 중...</div>}
                {isError && <div className="weather-message">날씨를 가져올 수 없어요.</div>}
                {weatherResponse?.data && (
                    <>
                        <div className="weather-location">
                            {weatherResponse.data.city}
                        </div>
                        <div className="weather-content">
                            <img
                                src={`https://openweathermap.org/img/wn/${weatherResponse.data.icon}@2x.png`}
                                alt={weatherResponse.data.main}
                                className="weather-icon"
                            />
                            <div className="weather-details">
                                <p className="weather-main-text">
                                    {WEATHER_IN_KOREAN[weatherResponse.data.main] || weatherResponse.data.main}
                                </p>
                                <p className="weather-temp-current">
                                    {Math.round(weatherResponse.data.temp)}°
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Weather;