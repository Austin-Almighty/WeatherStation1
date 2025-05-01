// 天氣描述對照表 （emoji）
const weatherEmojis = [
    { keywords: ["多雲午後短暫雷陣雨"], emoji: "🌩️⛅" },
    { keywords: ["晴午後短暫雷陣雨"], emoji: "🌩️☀️" },
    { keywords: ["多雲短暫陣雨"], emoji: "🌧️⛅" },
    { keywords: ["陰短暫陣雨"], emoji: "🌧️☁️" },
    { keywords: ["雷陣雨"], emoji: "⛈️" },
    { keywords: ["短暫陣雨"], emoji: "🌦️" },
    { keywords: ["陰"], emoji: "☁️" },
    { keywords: ["多雲時晴"], emoji: "🌥️" },
    { keywords: ["晴時多雲"], emoji: "🌤️" },
    { keywords: ["多雲"], emoji: "⛅" },
    { keywords: ["晴"], emoji: "☀️" }
];

// 取得 天氣對應 emoji 函式
function getWeatherEmoji(description) {
    if (!description || typeof description !== "string") return "❓";
    for (const item of weatherEmojis) {
        if (item.keywords.some(word => description.includes(word))) {
            return item.emoji;
        }
    }
    return "❓";
}

// 串接縣市天氣資料 API
let cityWeatherData = {};
const cityMap = {
    TWTPE: "臺北市",
    TWTXG: "臺中市",
    TWKHH: "高雄市",
    TWTNN: "臺南市",
    TWNWT: "新北市",
    TWHUA: "花蓮縣",
    TWILA: "宜蘭縣",
    TWTTT: "臺東縣",
    TWPIF: "屏東縣",
    TWCHA: "彰化縣",
    TWYUN: "雲林縣",
    TWMIA: "苗栗縣",
    TWCYQ: "嘉義縣",
    TWCYI: "嘉義市",
    TWHSQ: "新竹縣",
    TWHSZ: "新竹市",
    TWKEE: "基隆市",
    TWTAO: "桃園市",
    TWNAN: "南投縣",
    TWKIN: "金門縣",
    TWLIE: "連江縣",
    TWPEN: "澎湖縣"
};
async function fetchWeatherData() {
    try {
        const response = await fetch("http://54.66.212.32:8000/forecast");
        const data = await response.json();

        // 監聽 SVG 地圖的 path
        document.querySelectorAll('svg path').forEach(area => {
            const cityId = area.getAttribute('id');  // ex. TWTPE
            const cityName = cityMap[cityId];

            // 滑鼠移至 SVG MAP 提示框
            area.addEventListener('mousemove', (e) => {
                if (cityName && data[cityName]) {
                    const info = data[cityName];
                    const emoji = getWeatherEmoji(info.Wx[0]);
                    tooltip.innerHTML = `
            <strong>${cityName}</strong><br>
            天氣：${info.Wx[0]} ${emoji}<br>
            氣溫：${info.Temp[0]}℃
            <div style="margin-top: 8px; font-size: 13px; color: #888;">👉 詳細天氣資訊</div>
          `;
                    tooltip.style.top = (e.pageY + 15) + 'px';
                    tooltip.style.left = (e.pageX + 15) + 'px';
                    tooltip.style.opacity = '1';
                    tooltip.style.visibility = 'visible';
                }
            });
            // 滑鼠離開 SVG MAP 提示框隱藏
            area.addEventListener("mouseleave", () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });
            // 綁定點擊事件（cityName 對應 /info?city= )
            area.addEventListener("click", () => {
                if (cityName) {
                    window.location.href = `/info?city=${encodeURIComponent(cityName)}`;
                    console.log(cityName)
                }
            });
        });

    } catch (error) {
        console.error('天氣資料抓取失敗:', error);
    }
}

fetchWeatherData();

// Map 提示box
const tooltip = document.getElementById('tooltip');


// burger button 
const burger = document.getElementById('burger');
const navbarMenu = document.getElementById('navbarMenu');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navbarMenu.classList.toggle('active');
});

// 如果點擊選單按鈕想要自動收回
navbarMenu.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
        burger.classList.remove('active');
    });
});

// 查詢縣市即時天氣函式(obs-county) & 搜尋視窗
function toggleSearchBox() {
    const box = document.getElementById("weatherSearchBox");
    box.classList.toggle("show");
}


async function searchWeather() {
    const city = document.getElementById("cityselect").value;
    const resultBox = document.getElementById("resultBox");
    if (!city) {
        showCustomAlert();
        return;
    }
    // loading 動畫
    resultBox.innerHTML = `
      <div class="dots-loader">
        <span></span><span></span><span></span>
      </div>
    `;
    resultBox.classList.remove("result-animate");


    try {
        const res = await fetch("http://54.66.212.32:8000/obs-county");
        const data = await res.json();
        const info = data[city];
        const updateTime = info.time.split("T")[1];
        const emoji = getWeatherEmoji(info.weather);
        if (info) {
            resultBox.innerHTML = `
            <h4 class="result-title">${city}</h4>
            <p>天氣：${info.weather}${emoji}</p>
            <p>氣溫：${info.temp}°C</p>
            <p>濕度：${info.humidity}％</p>
            <p>降雨率：${info.rain}％</p>
            <p class="update-time">更新時間：${updateTime}</p>
          `;
            resultBox.classList.add("result-animate");
        } else {
            resultBox.innerHTML = `<p style="color: red;">查無此縣市</p>`;
        }
    } catch (err) {
        resultBox.innerHTML = `<p style="color: red;">資料抓取失敗</p>`;
        console.error(err);
    }
}
// Search Box close button
document.getElementById("closeSearchBox").addEventListener("click", () => {
    const box = document.getElementById("weatherSearchBox");
    const resultBox = document.getElementById("resultBox");
    const select = document.getElementById("cityselect");

    box.classList.remove("show");        // 關閉顯示
    resultBox.innerHTML = "";           // 清空查詢結果
    select.selectedIndex = 0;           // 重設選單為第一個選項
});

// 網頁載入後自動顯示地圖提示文字（如「滑動查看天氣資訊」）
// 並於 3 秒後自動淡出
window.addEventListener("load", () => {
    const hint = document.getElementById("mapHint");
    hint.classList.add("show");

    // 3 秒後自動消失
    setTimeout(() => {
        hint.classList.remove("show");
    }, 3000);
});

// 縣市選擇提醒視窗函式
function showCustomAlert() {
    const alertBox = document.getElementById("customAlert");
    alertBox.classList.add("show");
}

function closeCustomAlert() {
    const alertBox = document.getElementById("customAlert");
    alertBox.classList.remove("show");
}




