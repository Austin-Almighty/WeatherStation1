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

test(getObsCounty);