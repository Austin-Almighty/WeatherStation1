let KEY = "CWA-A67F62A2-EBCB-41D7-B9F6-59F2310F45FB";

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

async function test(callback) {
    let test = await callback();
    console.log(test)
}



async function getRainCounty() {
    let ID = "O-A0002-001";
    let StationName = ["基隆", "臺北", "新北", "桃園", "新竹市東區", "新竹", "苗栗", "臺中", "田中", "日月潭", "古坑", "嘉義", "民雄", "臺南", "高雄", "屏東", "宜蘭", "花蓮", "臺東", "澎湖", "金門", "馬祖"];
    let URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${ID}?Authorization=${KEY}&StationName=${StationName}`;
    let res = await fetch(URL);
    let resData = await res.json();
    let records = resData.records;
    let stations = records.Station;
    let result = {};
    for (let i = 0; i < stations.length; i++) {
      let geoInfo = stations[i].GeoInfo;
      let county = geoInfo.CountyName;
      let town = geoInfo.TownName;
      let name = stations[i].StationName;
      let rain = stations[i].RainfallElement.Now.Precipitation;
      if (stations[i].Maintainer == "中央氣象署") {
        result[county] = { rain: rain };
      }
    }
    console.log(result)
    return result;
  }

async function getForecastCounty(county) {
  let response = await fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${KEY}&limit=5&offset=0&format=JSON&LocationName=${county}&ElementName=%E5%B9%B3%E5%9D%87%E6%BA%AB%E5%BA%A6,%E5%A4%A9%E6%B0%A3%E7%8F%BE%E8%B1%A1&sort=time`)
  if (response.ok) {
    let result = await response.json()
    console.log(result.records)
  }
}

getForecastCounty("新北市")