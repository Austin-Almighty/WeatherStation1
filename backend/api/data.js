let KEY = "CWA-A67F62A2-EBCB-41D7-B9F6-59F2310F45FB";


async function getRainCounty() {
  let ID = "O-A0002-001";
  let StationName = ["基隆", "臺北", "新北", "桃園", "新竹市東區", "新竹", "苗栗", "臺中", "田中", "日月潭", "古坑", "嘉義", "民雄", "臺南", "高雄", "屏東", "宜蘭", "花蓮", "臺東", "澎湖", "金門", "馬祖"];
  let URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${ID}?Authorization=${KEY}&StationName=${StationName}`;
  let res = await fetch(URL);
  let resData = await res.json();
  let records = resData.records;
  let stations = records.Station;
  let result = {};
  let CountyName = ['基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'];
  for (let i = 0; i < CountyName.length; i++) {
    result[CountyName[i]] = {
      name: StationName[i],
      rain: -99,
    };
  }
  for (let i = 0; i < stations.length; i++) {
    let geoInfo = stations[i].GeoInfo;
    let county = geoInfo.CountyName;
    let town = geoInfo.TownName;
    let name = stations[i].StationName;
    let rain = stations[i].RainfallElement.Now.Precipitation;
    if (stations[i].Maintainer == "中央氣象署") {
      result[county].rain = rain;
    }
  }
  return result;
}


async function getRainTown() {
  let ID = "O-A0002-001";
  let CountyName = ['基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'];
  let URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${ID}?Authorization=${KEY}`;
  let res = await fetch(URL);
  let resData = await res.json();
  let records = resData.records;
  let stations = records.Station;
  let result = {};
  for (let county of CountyName) {
    result[county] = {};
  }
  for (let i = 0; i < stations.length; i++) {
    let county = stations[i].GeoInfo.CountyName;
    let rain = stations[i].RainfallElement.Now.Precipitation;
    let name = stations[i].StationName;
    result[county][name] = { rain: rain };
  }
  return result;
}


async function getForecast() {
  let ID = "F-C0032-001";
  let URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${ID}?Authorization=${KEY}`;
  let res = await fetch(URL);
  let resData = await res.json();
  let records = resData.records;
  let locations = records.location;
  let result = {}
  for (let i = 0; i < locations.length; i++) {
    let name = locations[i].locationName;
    let weather = locations[i].weatherElement;
    let forecast = {};
    let interval = [];
    for (let j = 0; j < weather.length; j++) {
      let element = weather[j].elementName;
      let time = weather[j].time;
      let param = [];
      for (let k = 0; k < time.length; k++) {
        interval[k] = time[k].startTime.slice(5, 16) + " ~ " + time[k].endTime.slice(5, 16);
        param[k] = time[k].parameter.parameterName;
      }
      forecast[element] = param;
    }
    forecast.Intv = interval;
    forecast.Temp = [
      forecast.MinT[0] + " ~ " + forecast.MaxT[0],
      forecast.MinT[1] + " ~ " + forecast.MaxT[1],
      forecast.MinT[2] + " ~ " + forecast.MaxT[2]
    ]
    delete forecast.MinT;
    delete forecast.MaxT;
    let tmp = JSON.stringify(forecast);
    let copy = JSON.parse(tmp);
    result[name] = copy;
  }
  return result;
}


async function getObsCounty() {
  let ID = "O-A0003-001";
  let StationName = ["基隆", "臺北", "新北", "中央大學", "國一N094K", "新竹", "苗栗農改", "臺中", "田中", "日月潭", "古坑", "嘉義", "嘉義分場", "臺南", "高雄", "屏東", "宜蘭", "花蓮", "臺東", "澎湖", "金門", "馬祖"];
  let URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${ID}?Authorization=${KEY}&StationName=${StationName}`;
  let res = await fetch(URL);
  let resData = await res.json();
  let records = resData.records;
  let stations = records.Station;
  let result = {};
  let CountyName = ['基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'];
  for (let county of CountyName) {
    result[county] = {
      name: -99,
      time: -99,
      temp: -99,
      humidity: -99,
      weather: -99,
      rain: -99,
    };
  }
  for (let i = 0; i < stations.length; i++) {
    let county = stations[i].GeoInfo.CountyName;
    let name = stations[i].StationName;
    result[county].name = name;
    result[county].time = stations[i].ObsTime.DateTime.slice(5, 16);
    result[county].temp = stations[i].WeatherElement.AirTemperature;
    result[county].humidity = stations[i].WeatherElement.RelativeHumidity;
    result[county].weather = stations[i].WeatherElement.Weather;
    result[county].rain = stations[i].WeatherElement.Now.Precipitation;
  }
  return result;
}


async function getObsTown() {
  let ID = "O-A0003-001";
  let CountyName = ['基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'];
  let URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${ID}?Authorization=${KEY}`;
  let res = await fetch(URL);
  let resData = await res.json();
  let records = resData.records;
  let stations = records.Station;
  let result = {};
  for (let county of CountyName) {
    result[county] = {};
  }
  for (let i = 0; i < stations.length; i++) {
    let county = stations[i].GeoInfo.CountyName;
    let name = stations[i].StationName;
    result[county][name] = {};
    result[county][name].time = stations[i].ObsTime.DateTime.slice(5, 16);
    result[county][name].temp = stations[i].WeatherElement.AirTemperature;
    result[county][name].humidity = stations[i].WeatherElement.RelativeHumidity;
    result[county][name].weather = stations[i].WeatherElement.Weather;
    result[county][name].rain = stations[i].WeatherElement.Now.Precipitation;
  }
  return result;
}