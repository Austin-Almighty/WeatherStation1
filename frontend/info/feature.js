let KEY = "CWA-A67F62A2-EBCB-41D7-B9F6-59F2310F45FB";

const params = new URLSearchParams(window.location.search);
const city = params.get("city");



async function getForecast() {
  let response = await fetch("http://54.66.212.32:8000/forecast")
  let result = await response.json();
  return result;
}



async function renderInfo(city) {
    let result = await getForecast();
    const cityElements = document.querySelectorAll(".city");
    cityElements.forEach(div=>{
        div.textContent = city;
    });
    let weatherInfo = result[city];
    let overview = weatherInfo.Wx;
   
    const today_card_image = document.querySelectorAll(".today-img");
    today_card_image.forEach((img, i) => {
        switch (overview[i]) {
            case "多雲時晴":
                img.src="/info/assets/icons/clouds.svg"
                break;
            case "晴時多雲":
                img.src="/info/assets/icons/cloudy sun.svg"
                break;
            case "多雲短暫陣雨":
                img.src="/info/assets/icons/shower.svg"
                break;
            case "陰短暫陣雨":
                img.src="/info/assets/icons/umbrella.svg"
                break;
            case "陰時多雲短暫陣雨":
                img.src="/info/assets/icons/shower.svg"
                break;
            case "多雲":
                img.src="/info/assets/icons/cloudy sun.svg"
                break;
            default:
              img.src="/info/assets/icons/hot.svg"
              break;
        }
    })
    
    let timeframe = weatherInfo.Intv;
    const intervalElements = document.querySelectorAll(".forecast-time");
    timeframe.forEach((frame, i) => {
      const startTime = frame.slice(6, 11); // e.g., "00:00"
      const endTime = frame.slice(-5); // e.g., "06:00"
      const timeInterval = `${startTime}~${endTime}`;

      if (intervalElements[i]) {
        intervalElements[i].textContent = timeInterval;
      }
    });

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

    let today = await getCurrent(city);
    const today_weather = document.getElementById('today-overview');
    today_weather.textContent = today[0];
    const today_temp = document.getElementById("today-temperature");
    today_temp.textContent = today[1];

}





async function getRainCounty(city) {
  let response = await fetch("http://54.66.212.32:8000/obs-county");
  let result = await response.json();
  console.log(result);
  let display_info = result[city];
  console.log(display_info);
  let humidity = display_info.humidity;
  let rain = display_info.rain;
  const humidityElements = document.querySelector(".humidity");
  humidityElements.textContent = humidity;
  const rainfallElements = document.querySelector(".rainfall");
  rainfallElements.textContent = rain;
  let station = display_info.name;
  const stationName = document.getElementById("stationName");
  stationName.textContent = station;
  const time = display_info.time;
  const updateTime = document.getElementById("updateTime");
  updateTime.textContent = time;
  const randomPhoto = document.getElementById("randomPhoto");
  const list = [
    "/info/assets/img/cloudy afternoon.jpg",
    "/info/assets/img/cloudy day.jpg",
    "/info/assets/img/fog.jpg",
    "/info/assets/img/ivan-ulamec-F-kdP4Hk7lg-unsplash.jpg",
    "/info/assets/img/rain windown.jpg",
    "/info/assets/img/rain.jpg",
    "/info/assets/img/rainy night.jpg",
    "/info/assets/img/sun glasses.jpg",
    "/info/assets/img/sunny day.jpg",
    "/info/assets/img/sunny with cloud overcast.jpg",
    "/info/assets/img/thunder.jpg",
  ];
  const randomIndex = Math.floor(Math.random() * list.length);
  const selectedImage = list[randomIndex];
  randomPhoto.src = selectedImage;
}



  
async function getCurrent(city) {
    let ID = "0-A003-001";
    let station = "";
    switch (city) {
      case "臺北市":
        station = "臺北	";
        break;
      case "台北市":
        station = "臺北	";
        break;
      case "基隆市":
        station = "基隆";
        break;
      case "新北市":
        station = "新北";
        break;
      case "連江縣":
        station = "馬祖";
        break;
      case "宜蘭縣":
        station = "宜蘭";
        break;
      case "新竹市":
        station = "新竹市東區";
        break;
      case "新竹縣":
        station = "新竹";
        break;
      case "桃園市":
        station = "新屋";
        break;
      case "苗栗縣":
        station = "後龍";
        break;
      case "台中市":
        station = "臺中";
        break;
      case "臺中市":
        station = "臺中";
        break;
      case "彰化縣":
        station = "田中";
        break;
      case "南投縣":
        station = "埔里";
        break;
      case "嘉義市":
        station = "嘉義";
        break;
      case "嘉義縣":
        station = "中埔	";
        break;
      case "雲林縣":
        station = "古坑";
        break;
      case "台南市":
        station = "臺南";
        break;
      case "臺南市":
        station = "臺南";
        break;
      case "高雄市":
        station = "高雄";
        break;
      case "澎湖縣":
        station = "澎湖";
        break;
      case "金門縣":
        station = "金門";
        break;
      case "屏東縣":
        station = "恆春";
        break;
      case "台東縣":
        station = "成功";
        break;  
      case "臺東縣":
        station = "成功";
        break;  
      case "花蓮縣":
        station = "花蓮";
        break;
    }
    let URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${KEY}&format=JSON&StationName=${station}&WeatherElement=Weather,AirTemperature&GeoInfo=CountyName`;
    let res = await fetch(URL);
    let resData = await res.json();
    let weather = resData.records.Station[0].WeatherElement.Weather;
    let temp = resData.records.Station[0].WeatherElement.AirTemperature;
    return [weather, temp]
  }
  


renderInfo(city)
getRainCounty(city)

