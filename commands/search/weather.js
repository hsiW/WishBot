let axios = require('axios'),
    options = require("./../../options/options.json");

module.exports = {
    usage: "Prints out weather information for the mentioned place. Sometimes a country is requires to work properly\n`weather [location]`",
    cooldown: 5,
    process: (bot, msg, suffix) => {
        if (!suffix) suffix = "Toronto";
        suffix = suffix.replace(" ", "");
        let URL = (/\d/.test(suffix) == false) ? "http://api.openweathermap.org/data/2.5/weather?q=" + suffix + "&APPID=" + options.weather_api_key : "http://api.openweathermap.org/data/2.5/weather?zip=" + suffix + "&APPID=" + options.weather_api_key;
        axios.get(URL).then(response => {
            if (response.status == 200) {
                let weath = response.data;
                if (!weath.hasOwnProperty("weather")) return;
                let weatherC = "☀";
                if ((weath.weather[0].description.indexOf("rain") > -1) || (weath.weather[0].description.indexOf("drizzle") > -1)) weatherC = "☔";
                else if (weath.weather[0].description.indexOf("snow") > -1) weatherC = "❄";
                else if (weath.weather[0].description.indexOf("clouds") > -1) weatherC = "☁";
                else if (weath.weather[0].description.indexOf("storm") > -1) weatherC = "⚡";
                let direction = Math.floor((weath.wind.deg / 22.5) + 0.5),
                    compass = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
                    sunrise = new Date(weath.sys.sunrise * 1000),
                    formattedSunrise = (sunrise.getHours()) + ':' + ("0" + sunrise.getMinutes()).substr(-2),
                    sunset = new Date(weath.sys.sunset * 1000),
                    formattedSunset = (sunset.getHours()) + ':' + ("0" + sunset.getMinutes()).substr(-2),
                    msgString = "🌎 __**Weather for " + weath.name + ", " + weath.sys.country + ":**__ • (*" + weath.coord.lon + ", " + weath.coord.lat + "*)";
                msgString += "\n**" + weatherC + "Current Weather Conditions:** " + weath.weather[0].description;
                msgString += "\n**:sweat: Humidity:** " + weath.main.humidity + "% - **🌆 Current Temperature:** " + Math.round(weath.main.temp - 273.15) + "°C / " + Math.round(((weath.main.temp - 273.15) * 1.8) + 32) + "°F";
                msgString += "\n**:cloud: Cloudiness:** " + weath.clouds.all + "% - **💨 Wind Speed:** " + weath.wind.speed + " m/s [*" + compass[(direction % 16)] + "*]";
                msgString += "\n**🌄 Sunrise:** " + formattedSunrise + " UTC / **🌇 Sunset:** " + formattedSunset + " UTC";
                bot.createMessage(msg.channel.id, msgString);
            } else bot.createMessage(msg.channel.id, "There was an error getting the weather, please try again later.");
        }).catch(err => bot.createMessage(msg.channel.id, "There was an error getting the weather: ```" + err+"```"))
    }
} //Should clean up code but so much work so i'll do it some other day