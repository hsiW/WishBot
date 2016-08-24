let axios = require('axios'),
    moment = require('moment'),
    options = require("./../../options/options.json"),
    compass = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

module.exports = {
    usage: "Returns weather information for the inputted place. Sometimes a country is required to search for the right location.\n`weather [location]`",
    cooldown: 5,
    process: (bot, msg, suffix) => {
        if (!suffix) suffix = "Toronto";
        suffix = suffix.replace(" ", "+");
        let URL = (/\d/.test(suffix) == false) ? "http://api.openweathermap.org/data/2.5/weather?q=" + suffix + "&APPID=" + options.weather_api_key : "http://api.openweathermap.org/data/2.5/weather?zip=" + suffix + "&APPID=" + options.weather_api_key;
        axios.get(URL).then(response => {
            if (response.status == 200 && response.data.cod !== '404') { //This should be cod, the API is stupid and doesnt return code
                let weath = response.data,
                    weatherC = "☀";
                if (!weath.hasOwnProperty("weather")) return;
                if ((weath.weather[0].description.indexOf("rain") > -1) || (weath.weather[0].description.indexOf("drizzle") > -1)) weatherC = "☔";
                else if (weath.weather[0].description.indexOf("snow") > -1) weatherC = "❄";
                else if (weath.weather[0].description.indexOf("clouds") > -1) weatherC = "☁";
                else if (weath.weather[0].description.indexOf("storm") > -1) weatherC = "⛈";
                bot.createMessage(msg.channel.id, `🌎 __**Weather for ${weath.name === '' ? '' : weath.name+','} ${weath.sys.country}:**__ • (*${weath.coord.lon}, ${weath.coord.lat}*)
**${weatherC} Current Weather Conditions:** ${weath.weather[0].description}
**😓 Humidity:** ${weath.main.humidity}% **|** **🌡 Current Temperature:** ${Math.round(weath.main.temp - 273.15)}°C / ${Math.round(((weath.main.temp - 273.15) * 1.8) + 32)}°F
**☁ Cloudiness:** ${weath.clouds.all}% **|** **💨 Wind Speed:** ${weath.wind.speed} m/s [*${compass[((Math.floor((weath.wind.deg / 22.5) + 0.5)) % 16)]}*]
**🌄 Sunrise:** ${moment(weath.sys.sunrise * 1000).format('HH:mm')} UTC **|** **🌇 Sunset:** ${moment(weath.sys.sunset * 1000).format('HH:mm')} UTC`);
            } else bot.createMessage(msg.channel.id, "There was an error getting the weather for that location. Please try again later.")
        }).catch(err => bot.createMessage(msg.channel.id, "There was an error getting the weather: ```" + err + "```"))
    }
}