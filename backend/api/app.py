from dotenv import load_dotenv
load_dotenv()


from fastapi import *
import urllib.request as req
import json, ssl, os
app = FastAPI()


@app.get("/raining")
async def get_raining(response: Response, limit:int=10000):
  response.headers.append("Access-Control-Allow-Origin", "*")
  ID = "O-A0002-001"
  KEY = os.getenv("KEY")
  URL = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/{ID}?Authorization={KEY}&limit={limit}"
  context = ssl._create_unverified_context()
  with req.urlopen(URL, context=context) as res:
    data = json.load(res)
  stations = data["records"]["Station"]
  result = {}
  for station in stations:
    county = station["GeoInfo"]["CountyName"]
    result[county] = {}
  for station in stations:
    county = station["GeoInfo"]["CountyName"]
    town = station["GeoInfo"]["TownName"]
    result[county][town] = {}
  for station in stations:
    county = station["GeoInfo"]["CountyName"]
    town = station["GeoInfo"]["TownName"]
    name = station["StationName"]
    rain = station["RainfallElement"]["Now"]["Precipitation"]
    result[county][town][name] = rain
  return result


@app.get("/forecast")
async def get_raining(response: Response):
  response.headers.append("Access-Control-Allow-Origin", "*")
  ID = "F-C0032-001"
  KEY = os.getenv("KEY")
  URL = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/{ID}?Authorization={KEY}"
  context = ssl._create_unverified_context()
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


