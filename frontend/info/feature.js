let KEY = "CWA-A67F62A2-EBCB-41D7-B9F6-59F2310F45FB";

async function getForecast() {
    let ID = "F-C0032-001";
    let URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${ID}?Authorization=${KEY}&format=JSON`;
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
    console.log(result["臺北市"])
    return result;
  }



async function getCurrent() {
    let ID = "0-A003-001";
    let URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${ID}?Authorization=${KEY}`;
    let res = await fetch(URL);
    let resData = await res.json();
    // let locations = resData.records.location;
    console.log(resData);
    // console.log(resData.records.location[0])
}

getCurrent();

async function renderInfo(city) {
    let result = await getForecast();
    const cityElements = document.querySelectorAll(".city");
    cityElements.forEach(div=>{
        div.textContent = city;
    });
    let weatherInfo = result[city];
    let overview = weatherInfo.Wx;
    const overview_div = document.getElementById('overview');
    overview_div.textContent = overview;
    const today_card_image = document.querySelectorAll(".today-img");
    today_card_image.forEach((img, i) => {
        switch (overview[i]) {
            case "多雲時晴":
                img.src="./assets/icons/cloud.svg"
                break;
            case "晴時多雲":
                img.src="./assets/icons/cloudy sun.svg"
                break;
            case "多雲短暫陣雨":
                img.src="./assets/icons/showers.svg"
                break;
            case "陰短暫陣雨":
                img.src="./assets/icons/umbrella.svg"
                break;
            case "陰時多雲短暫陣雨":
                img.src="./assets/icons/shower.svg"
                break;
            case "多雲":
                img.src="./assets/icons/clouds.svg"
                break;
        }
    })
    

    let rain_probability = weatherInfo.PoP;
    const rain_div = document.querySelectorAll(".rain");
    rain_div.forEach((div, i) => {
        if (i < rain_probability.length) {
            div.textContent = rain_probability[i];
        }
    })

    let feel = weatherInfo.CI;
    const feel_div = document.querySelectorAll(".feel");
    feel_div.forEach((div, i) => {
        if (i < feel.length) {
            div.textContent = feel[i];
        }
    })
    let temp = weatherInfo.Temp;
    const temp_div = document.querySelectorAll(".temp");
    temp_div.forEach((div, i) => {
        if (i < temp.length) {
            div.textContent = temp[i];
        }
    });

}

renderInfo("臺北市");



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
    return result;
  }

