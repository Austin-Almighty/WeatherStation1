from dotenv import load_dotenv
import os, requests
load_dotenv()
KEY = os.getenv("KEY")


from fastapi import FastAPI, Response
app = FastAPI()


CountyName = ["基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣", "金門縣", "連江縣"]
StationName = ["基隆", "臺北", "新北", "中央大學", "國一N094K", "新竹", "苗栗農改", "臺中", "田中", "日月潭", "古坑", "嘉義", "嘉義分場", "臺南", "高雄", "屏東", "宜蘭", "花蓮", "臺東", "澎湖", "金門", "馬祖"]


@app.get("/forecast")
async def get_forecast(response:Response, q:str|None=None):
  response.headers.append("Access-Control-Allow-Origin", "*")
  ID = "F-C0032-001"
  url = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/{ID}?Authorization={KEY}"
  if q in CountyName:
    url += f"&locationName={q}"
  res = requests.get(url)
  resData = res.json()
  records = resData["records"]
  locations = records["location"]
  result = {}
  for location in locations:
    name = location["locationName"]
    weathers = location["weatherElement"]
    forecast = {}
    interval = []
    for weather in weathers:
      elemt = weather["elementName"]
      times = weather["time"]
      meter = []
      for time in times:
        if len(interval) < 3:
          start = time["startTime"][5:16]
          end = time["endTime"][5:16]
          interval.append(start + " ~ " + end)
        meter.append(time["parameter"]["parameterName"])
      forecast[elemt] = meter
    forecast["Intv"] = interval
    forecast["Temp"] = [
      forecast["MinT"][0] + " ~ " + forecast["MaxT"][0],
      forecast["MinT"][1] + " ~ " + forecast["MaxT"][1],
      forecast["MinT"][2] + " ~ " + forecast["MaxT"][2],
    ]
    forecast.pop("MinT")
    forecast.pop("MaxT")
    result[name] = forecast
  return result


@app.get("/obs-county")
async def get_obs_county(response:Response, q:str|None=None):
  response.headers.append("Access-Control-Allow-Origin", "*")
  ID = "O-A0003-001"
  url = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/{ID}?Authorization={KEY}&StationName={",".join(StationName)}"
  res = requests.get(url)
  resData = res.json()
  records = resData["records"]
  stations = records["Station"]
  result = {}
  for county in CountyName:
    result[county] = {
      "name": -99,
      "time": -99,
      "temp": -99,
      "humidity": -99,
      "weather": -99,
      "rain": -99,
    }
  for station in stations:
    county = station["GeoInfo"]["CountyName"]
    name = station["StationName"]
    result[county]["name"] = name
    result[county]["time"] = station["ObsTime"]["DateTime"][5:16]
    result[county]["temp"] = station["WeatherElement"]["AirTemperature"]
    result[county]["humidity"] = station["WeatherElement"]["RelativeHumidity"]
    result[county]["weather"] = station["WeatherElement"]["Weather"]
    result[county]["rain"] = station["WeatherElement"]["Now"]["Precipitation"]
  def replace_negatives(d):
    for key, value in d.items():
      if isinstance(value, dict):
        replace_negatives(value)
      else:
        try:
          if float(value) < 0:
            d[key] = "-"
        except:
          continue
    return d
  result = replace_negatives(result)
  if q in CountyName:
    return result[q]
  return result


@app.get("/obs-town")
async def get_obs_town(response:Response, q:str|None=None):
  response.headers.append("Access-Control-Allow-Origin", "*")
  ID = "O-A0003-001"
  url = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/{ID}?Authorization={KEY}"
  res = requests.get(url)
  resData = res.json()
  records = resData["records"]
  stations = records["Station"]
  result = {}
  for county in CountyName:
    result[county] = {}
  for station in stations:
    county = station["GeoInfo"]["CountyName"]
    name = station["StationName"]
    result[county][name] = {}
    result[county][name]["time"] = station["ObsTime"]["DateTime"][5:16]
    result[county][name]["temp"] = station["WeatherElement"]["AirTemperature"]
    result[county][name]["humidity"] = station["WeatherElement"]["RelativeHumidity"]
    result[county][name]["weather"] = station["WeatherElement"]["Weather"]
    result[county][name]["rain"] = station["WeatherElement"]["Now"]["Precipitation"]
  if q in CountyName:
    return result[q]
  return result