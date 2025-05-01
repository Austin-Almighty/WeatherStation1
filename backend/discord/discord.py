import requests
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import os
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger

load_dotenv()

WEBHOOK_URL = os.getenv("WEBHOOK_URL")
ID = os.getenv("API_ID")
KEY = os.getenv("API_KEY")

TW_TZ = datetime.now(timezone(timedelta(hours=8)))
scheduler = BlockingScheduler(timezone=TW_TZ)


class CityWeatherInfo:
    def __init__(self, city: str, weather: str, ci: str, rain: str, temperature: str):
        self.city = city
        self.weather = weather
        self.ci = ci
        self.rain = rain  # 先用 str，依據資料再調整
        self.temperature = temperature # 先用 str，依據資料再調整


    def to_embed_field(self):
        return {
            "name": f"{self.city}",
            "value": f"天氣：\n{self.weather} {self.ci}\n{self.temperature}\n{self.rain}\n[{self.city}詳細天氣預報](http://52.35.40.79:8000/info?city={self.city})",
            "inline": True
        }

    def to_dict(self):
        return {
            "city": self.city,
            "weather": self.weather,
            "ci": self.ci,
            "temperature": self.temperature,
            "rain": self.rain
        }


class DiscordMessage:
    def __init__(
        self,
        username: str,
        # url: str,
        taipei: CityWeatherInfo,
        new_taipei: CityWeatherInfo,
        taoyuan: CityWeatherInfo,
        taichung: CityWeatherInfo,
        tainan: CityWeatherInfo,
        kaohsiung: CityWeatherInfo
    ):
        self.username = username
        # self.url = url
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
        if 6 <= hour < 16:
            period = "今天白天的"
        elif 16 <= hour < 22:
            period = "稍後晚上的"
        else:
            period = "明天白天的"

        self.embed = {
            "title": f"{TW_TZ.date()} {period}天氣預報",
            "description": f"以下為六都{period}的天氣預報，[其他縣市請點我](http://52.35.40.79:8000/)。",
            "color": 11038012,
            "timestamp": self.timestamp,
            "footer": {
            "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
            "text": "ご覧の 中央氣象署 の提供でお送りします。"
            },
            "thumbnail": {"url": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjtFq3c4REV1FsM-hXO_v72jW3-8DWm8amy8DcK2vgAKvCkoUO5NPqvyC8Wnz6fpJvCpscQIC1sSCWwwZ87wQyw6iiYt0EYE0ad4Bvhsh9IRPSE90oEw8UvLhgNs-SL0uSzjMv9i63Nt_l3/s400/job_otenki_oneesan.png"},
            "fields": [city.to_embed_field() for city in self.cities]
        }

    def to_dict(self):
        return {
            "username": self.username,
            "content": self.content,
            "embeds": [self.embed]
        }


def fetch_weather_data():

    url = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/{ID}?Authorization={KEY}&format=JSON"
    response = requests.get(url)
    dict_data = response.json()
    result = dict_data["records"]["location"]
    print(f"現在時間：{TW_TZ}")
    weather_data_dict = {}
    for city in result:
        city_name = city["locationName"]
        weather = city["weatherElement"] 
        """
        weather 是 list
        [0] 是天氣預報
        [1] 是降雨機率
        [2] 最低溫度
        [3] 舒適度
        [4] 最高溫度
        """

        weather_info = {
            "morning": {
                "weather": f"{weather[0]["time"][0]["parameter"]["parameterName"]}",
                "ci": f"{weather[3]["time"][0]["parameter"]["parameterName"]}",
                "rain": f"降雨機率：{weather[1]["time"][0]["parameter"]["parameterName"]}%",
                "temperature": f"氣溫：{weather[2]["time"][0]["parameter"]["parameterName"]} ~ {weather[4]["time"][0]["parameter"]["parameterName"]}°C"
            },
            "night": {
                "weather": f"{weather[0]["time"][1]["parameter"]["parameterName"]}",
                "ci": f"{weather[3]["time"][1]["parameter"]["parameterName"]}",
                "rain": f"降雨機率：{weather[1]["time"][1]["parameter"]["parameterName"]}%",
                "temperature": f"氣溫：{weather[2]["time"][1]["parameter"]["parameterName"]} ~ {weather[4]["time"][1]["parameter"]["parameterName"]}°C"
            },
        }

        hour = TW_TZ.hour
        if 6 <= hour < 16:
            weather_data_dict[city_name] = weather_info["morning"]
            
        else:
            weather_data_dict[city_name] = weather_info["night"]
        

    
    return weather_data_dict


def post_message_to_discord(
        input_username:str, 
        message_data: dict):

    message = DiscordMessage(
        username = input_username,
        taipei = CityWeatherInfo("臺北市", **message_data["臺北市"]),
        new_taipei=CityWeatherInfo("新北市", **message_data["新北市"]),
        taoyuan=CityWeatherInfo("桃園市", **message_data["桃園市"]),
        taichung=CityWeatherInfo("臺中市", **message_data["臺中市"]),
        tainan=CityWeatherInfo("臺南市", **message_data["臺南市"]),
        kaohsiung=CityWeatherInfo("高雄市", **message_data["高雄市"])
    )

    response = requests.post(WEBHOOK_URL, json=message.to_dict())
    return {"status_code": response.status_code, "response": response.text}


@scheduler.scheduled_job(CronTrigger(hour='7,16,22', minute=0))
def main():
    print(f"[{TW_TZ.isoformat()}] 執行定時任務")
    weather_data = fetch_weather_data()
    input_username = "天氣預報機器人"
    post_message_to_discord(input_username, weather_data)


if __name__ == "__main__":
    scheduler.start()