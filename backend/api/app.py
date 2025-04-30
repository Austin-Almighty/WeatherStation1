from dotenv import load_dotenv
load_dotenv()


from fastapi import *
import urllib.request as req
import urllib.parse
import json, ssl, os
context = ssl._create_unverified_context()
app = FastAPI()


@app.get("/forecast")
async def get_raining(response: Response):
  response.headers.append("Access-Control-Allow-Origin", "*")
  ID = "F-C0032-001"
  KEY = os.getenv("KEY")
  URL = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/{ID}?Authorization={KEY}"
  # context = ssl._create_unverified_context()
  with req.urlopen(URL, context=context) as res:
    resData = json.load(res)
  records = resData["records"]
  locations = records["location"];
  result = {}
  for i in range(len(locations)):
    name = locations[i]["locationName"]
    weather = locations[i]["weatherElement"]
    forecast = {}
    interval = []
    for j in range(len(weather)):
      element = weather[j]["elementName"]
      time = weather[j]["time"]
      param = []
      for k in range(len(time)):
        if len(interval) < 3:
          interval.append(time[k]["startTime"][5:16] + " ~ " + time[k]["endTime"][5:16])
        param.append(time[k]["parameter"]["parameterName"])
      forecast[element] = param
    forecast["Intv"] = interval
    forecast["Temp"] = [
      forecast["MinT"][0] + " ~ " + forecast["MaxT"][0],
      forecast["MinT"][1] + " ~ " + forecast["MaxT"][1],
      forecast["MinT"][2] + " ~ " + forecast["MaxT"][2],
    ]
    forecast.pop("MinT")
    forecast.pop("MaxT")
    tmp = json.dumps(forecast)
    copy = json.loads(tmp)
    result[name] = copy
  return result


@app.get("/obs-county")
async def get_obs_county(response: Response):
  response.headers.append("Access-Control-Allow-Origin", "*")
  ID = "O-A0003-001"
  KEY = os.getenv("KEY")
  StationName = ["基隆", "臺北", "新北", "中央大學", "國一N094K", "新竹", "苗栗農改", "臺中", "田中", "日月潭", "古坑", "嘉義", "嘉義分場", "臺南", "高雄", "屏東", "宜蘭", "花蓮", "臺東", "澎湖", "金門", "馬祖"]
  StationName = ",".join(StationName)
  StationName = urllib.parse.quote(StationName)
  URL = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/{ID}?Authorization={KEY}&StationName={StationName}"
  # context = ssl._create_unverified_context()
  with req.urlopen(URL, context=context) as res:
    resData = json.load(res)
  records = resData["records"]
  stations = records["Station"]
  result = {}
  CountyName = ['基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣']
  for county in CountyName:
    result[county] = {
      "name": -99,
      "time": -99,
      "temp": -99,
      "humidity": -99,
      "weather": -99,
      "rain": -99,
    }
  for i in range(len(stations)):
    county = stations[i]["GeoInfo"]["CountyName"]
    name = stations[i]["StationName"]
    result[county]["name"] = name;
    result[county]["time"] = stations[i]["ObsTime"]["DateTime"][5:16]
    result[county]["temp"] = stations[i]["WeatherElement"]["AirTemperature"]
    result[county]["humidity"] = stations[i]["WeatherElement"]["RelativeHumidity"]
    result[county]["weather"] = stations[i]["WeatherElement"]["Weather"]
    result[county]["rain"] = stations[i]["WeatherElement"]["Now"]["Precipitation"]
  return result


@app.get("/obs-town")
async def get_obs_town(response:Response, q:str|None=None):
  response.headers.append("Access-Control-Allow-Origin", "*")
  ID = "O-A0003-001"
  KEY = os.getenv("KEY")
  URL = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/{ID}?Authorization={KEY}"
  # context = ssl._create_unverified_context()
  with req.urlopen(URL, context=context) as res:
    resData = json.load(res)
  records = resData["records"]
  stations = records["Station"]
  result = {}
  CountyName = ['基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣']
  for county in CountyName:
    result[county] = {}
  for i in range(len(stations)):
    county = stations[i]["GeoInfo"]["CountyName"]
    name = stations[i]["StationName"]
    result[county][name] = {}
    result[county][name]["time"] = stations[i]["ObsTime"]["DateTime"][5:16]
    result[county][name]["temp"] = stations[i]["WeatherElement"]["AirTemperature"]
    result[county][name]["humidity"] = stations[i]["WeatherElement"]["RelativeHumidity"]
    result[county][name]["weather"] = stations[i]["WeatherElement"]["Weather"]
    result[county][name]["rain"] = stations[i]["WeatherElement"]["Now"]["Precipitation"]
  if q in CountyName:
    return result[q]
  return result