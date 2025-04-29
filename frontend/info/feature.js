const api_key = "CWA-A67F62A2-EBCB-41D7-B9F6-59F2310F45FB";

async function get_current_weather() {
    let params = new URLSearchParams({
        // Authorization: api_key,
        locationName: "臺北市",
        format: "JSON",
    })
    let response = await fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": api_key,
        }
    })
    if (response.ok) {
        let result = await response.json();
        console.log(result)
        console.log(result.result.fields)
        console.log(result.records.location)
        console.log(result.records.location[0].weatherElement[0].time)
    } else {
        console.log(response.statusText)
    }
    
}

// get_current_weather();

let ID = "O-A0002-001";
    let KEY = "CWA-A67F62A2-EBCB-41D7-B9F6-59F2310F45FB";
    let URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${ID}?Authorization=${KEY}`;
    getRain();
    async function getRain() {
      let res = await fetch(URL);
      let resData = await res.json();
      let records = resData.records;
      let stations = records.Station;
      let result = {};
      for (let i = 0; i < stations.length; i++) {
        let geoInfo = stations[i].GeoInfo;
        let county = geoInfo.CountyName;
        result[county] = {};
      }
      for (let i = 0; i < stations.length; i++) {
        let geoInfo = stations[i].GeoInfo;
        let county = geoInfo.CountyName;
        let town = geoInfo.TownName;
        result[county][town] = {};
      }
      for (let i = 0; i < stations.length; i++) {
        let geoInfo = stations[i].GeoInfo;
        let county = geoInfo.CountyName;
        let town = geoInfo.TownName;
        let name = stations[i].StationName;
        let rain = stations[i].RainfallElement.Now.Precipitation;
        result[county][town][name] = rain;
      }
      console.log(result);
    }