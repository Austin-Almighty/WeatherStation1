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
