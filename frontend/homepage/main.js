// 假設縣市資料
const cityWeatherData = {
    TWTPE: { name: "台北市", weather: "晴天	☀️", temp: "28\u00b0C" },
    TWTXG: { name: "台中市", weather: "多雲	🌥️", temp: "25\u00b0C" },
    // 其他縣市資料
};

const tooltip = document.getElementById('tooltip');

// 監聽所有 path
document.querySelectorAll('svg path').forEach(area => {
    area.addEventListener('mousemove', (e) => {
        const cityId = area.id;
        const info = cityWeatherData[cityId];
        if (info) {
            tooltip.innerHTML = `
          <strong>${info.name}</strong><br>
          天氣：${info.weather}<br>
          氣溫：${info.temp}
          <div style="margin-top: 8px; font-size: 13px; color: #888;">
                    👉 詳細天氣資訊
          </div>
        `
                ;
            tooltip.style.display = 'block';
            tooltip.style.top = (e.pageY + 15) + 'px';
            tooltip.style.left = (e.pageX + 15) + 'px';
        }
    });

    area.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
});

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








