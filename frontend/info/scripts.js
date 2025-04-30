
const current_time = new Date();
console.log(current_time);

const date = current_time.getDate();
const month = current_time.getMonth()+1;
const day = current_time.getDay();
const year = current_time.getFullYear();
const hours = current_time.getHours().toString().padStart(2, "0");
const minutes = current_time.getMinutes().toString().padStart(2, "0");
const seconds = current_time.getSeconds().toString().padStart(2, "0");

console.log(day);

let weekday = "日";
switch (day) {
    case 0:
        weekday = "日"; 
        break
    case 1:
        weekday = "一";
        break
    case 2:
        weekday = "二";
        break
    case 3:
        weekday = "三";
        break
    case 4:
        weekday = "四";
        break
    case 5:
        weekday = "五";
        break
    case 6:
        weekday = "六";
        break
}

const display_date = `${year}年${month}月${date}日 星期${weekday}`;


const date_div = document.getElementById("date");
date_div.textContent = display_date;

function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('time-now').textContent = `${hours}:${minutes}:${seconds}`;
}
updateTime();
setInterval(updateTime, 1000);

