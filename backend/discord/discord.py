from fastapi import APIRouter, Request, Body
import requests
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

WEBHOOK_URL = os.getenv("WEBHOOK_URL")

class CityWeatherInfo:
    def __init__(self, city: str, weather: str, temperature: str, rain: str):
        self.city = city
        self.weather = weather
        self.temperature = temperature # 先用 str，依據資料再調整
        self.rain = rain  # 先用 str，依據資料再調整

    def to_embed_field(self):
        return {
            "name": self.city,
            "value": f"天氣：{self.weather}\n氣溫：{self.temperature}\n降雨量：{self.rain}",
            "inline": True
        }

    def to_dict(self):
        return {
            "city": self.city,
            "weather": self.weather,
            "temperature": self.temperature,
            "rain": self.rain
        }


class DiscordMessage:
    def __init__(
        self,
        username: str,
        url: str,
        taipei: CityWeatherInfo,
        new_taipei: CityWeatherInfo,
        taoyuan: CityWeatherInfo,
        taichung: CityWeatherInfo,
        tainan: CityWeatherInfo,
        kaohsiung: CityWeatherInfo
    ):
        self.username = username
        self.url = url
        self.content = "每日定時天氣預報"
        self.cities = [
            taipei, new_taipei, taoyuan,
            taichung, tainan, kaohsiung
        ]
        self.weather_info_dict = {
            city.city: {
                "天氣": city.weather,
                "氣溫": city.temperature,
                "降雨量": city.rain
            } for city in self.cities
        }

        # 台灣時區 UTC+8
        TW_TZ = datetime.now(timezone(timedelta(hours=8)))

        self.timestamp = TW_TZ.isoformat()

        hour = TW_TZ.hour
        if 6 <= hour < 18:
            period = "白天"
        else:
            period = "晚上"

        self.embed = {
            "title": f"{TW_TZ.date()} {period}天氣預報",
            "description": f"{TW_TZ.date()} 六都{period}的天氣預報，其餘縣市資訊請[點我]({self.url})或標題了解更多。",
            "url": self.url,
            "color": 11038012,
            "timestamp": self.timestamp,
            "thumbnail": {
                "url": "https://static.cdnlogo.com/logos/w/44/weather-ios.svg"
            },
            "fields": [city.to_embed_field() for city in self.cities]
        }

    def to_dict(self):
        return {
            "username": self.username,
            "content": self.content,
            "embeds": [self.embed]
        }


@router.post("/post-weather")
async def post_message_to_discord(request: Request, message_data: dict = Body(...)):

    message = DiscordMessage(
        username=message_data["username"],
        title=message_data["title"],
        url=message_data["url"],
        taipei=CityWeatherInfo("台北市", **message_data["taipei"]),
        new_taipei=CityWeatherInfo("新北市", **message_data["new_taipei"]),
        taoyuan=CityWeatherInfo("桃園市", **message_data["taoyuan"]),
        taichung=CityWeatherInfo("台中市", **message_data["taichung"]),
        tainan=CityWeatherInfo("台南市", **message_data["tainan"]),
        kaohsiung=CityWeatherInfo("高雄市", **message_data["kaohsiung"])
    )

    response = requests.post(WEBHOOK_URL, json=message.to_dict())
    return {"status_code": response.status_code, "response": response.text}
