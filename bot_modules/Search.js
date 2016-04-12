var options = require("./../options/options.json");
var prefix = require("./../options/options.json").prefixes;
var request = require('request');
var xml2js = require('xml2js');
var qs = require("querystring");
var YouTube = require('youtube-node');
var Wiki = require('wikijs');
var fix = require('entities');
var google = require("google");
var chalk = require("chalk"), c = new chalk.constructor({enabled: true});
var channelC = c.green.bold, userC = c.cyan.bold, warningC = c.yellow.bold, errorC = c.red.bold, botC = c.magenta.bold;
var youTube = new YouTube();
youTube.setKey(options.youtube_api_key);
var imugr_id = options.imgur_id;


String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

var searches = {
  "google": {
		usage: "Prints out the first search result for the mentioned terms\n`google [search terms]`",
    delete: true,
    cooldown: 5,
		process: function (bot, msg, suffix){
      var search = "google";
      if(suffix){search = suffix;}
      google(search, function(err, response){
        if(err || !response || !response.links || response.links.length < 1){bot.sendMessage(msg, "Your search resulted in an error. Please forgive me **"+msg.author.username+"**-senpai! ;-;", function(error, sentMessage){bot.deleteMessage(sentMessage, {"wait": 5000})});}
        else {
          if(response.links[0].link === null){
            for(i = 1; i < response.links.length; i++){
              if (response.links[i].link !== null) {
                bot.sendMessage(msg, "I searched for **\""+search+"\"** and found this, **"+msg.author.username+"**-senpai: \n"+response.links[i].link);
                return;
              }
            }
          }
          else {
            bot.sendMessage(msg, "I searched for **\""+search+"\"** and found this, **"+msg.author.username+"**-senpai: \n"+response.links[0].link);
          }
        }
      })
    }
	},
  "youtube": {
		usage: "Prints out the first YouTube link for the mentioned terms\n`youtube [terms]`",
    delete: true,
    cooldown: 5,
		process: function (bot, msg, suffix) {
			youTube.search(suffix, 10, function (error, result) {
				if (error || !result || !result.items || result.items.length < 1) {bot.sendMessage(msg, "Your search resulted in an error. Please forgive me **"+msg.author.username+"**-senpai! ;-;", function(error, sentMessage){bot.deleteMessage(sentMessage, {"wait": 5000})});}
				else {
					if (typeof result.items[0].id.videoId === "undefined") {
						for (i = 1; i < result.items.length; i++) {
							if (typeof result.items[i].id.videoId !== "undefined") {bot.sendMessage(msg, "I searched for **"+suffix+"** and found this **"+msg.author.username+"**-senpai: \nhttps://www.youtube.com/watch?v=" + result.items[i].id.videoId); return;}
						}
					}
					else {bot.sendMessage(msg, "I searched for **\""+suffix+"\"** and found this, **"+msg.author.username+"**-senpai: \nhttps://www.youtube.com/watch?v=" + result.items[0].id.videoId);}
				}
			});
		}
	},
  "stardew": {
		usage: "Prints out a link to the Stardew Valley Wiki for the mentioned topic\n`stardew [topic]`",
    delete: true,
    cooldown: 5,
		process: function (bot, msg, suffix){var topic = "Stardew_Valley_Wiki"; if(suffix){topic = suffix.capitalize(); topic = topic.replace(/ /gi,"_");}
    bot.sendMessage(msg, "**"+msg.author.username+"**-senpai, I searched for **\""+suffix+"\"** and found\nhttp://stardewvalleywiki.com/"+topic);
  }
	},
  "gif": {
		usage: "Searches Giphy using the mentioned tags\n`gif [tag1], [tag2], ect`",
    delete: true,
    cooldown: 5,
		process: function (bot, msg, suffix) {
			var tags = suffix.split(",");
			get_gif(tags, bot, msg, function (id) {
				if (typeof id !== "undefined") {bot.sendMessage(msg,"With the tags: **(Tags:** *" + (tags ? tags : "Random GIF") + "* **)** I found this gif, **"+msg.author.username+"**-senpai:\nhttp://media.giphy.com/media/" + id + "/giphy.gif ");}
				else {bot.sendMessage(msg, "Invalid tags **"+msg.author.username+"**-senpai, please try something different.", function(error, sentMessage){bot.deleteMessage(sentMessage, {"wait": 5000})});}
			});
		}
	},
  "reddit": {
		usage: "Prints out a link to the top post on the mentioned subreddit if none is mentioned the top post of /r/all is linked\n`reddit [subreddit]`",
    delete: true,
    cooldown: 5,
		process: function (bot, msg, suffix) {
			var path = "/.rss"
			if (suffix) {path = "/r/" + suffix + path}
			rssfeed(bot, msg, "https://www.reddit.com" + path, 1, false);
		}
	},
  "wiki": {
		usage: "Prints out a Wikipedia link for the mentioned terms\n`wiki [terms]`",
    delete: true,
    cooldown: 5,
		process: function (bot, msg, suffix) {
			if (suffix) {
				new Wiki().search(suffix, 1).then(function (data) {
						new Wiki().page(data.results[0]).then(function (page) {bot.sendMessage(msg, "**"+msg.author.username+"**, I searched for **\"" + suffix+"\"** and found this, Senpai: \n" + page.fullurl)});
					});
			}
			else {bot.sendMessage(msg, "You need to enter a topic to be searched, **"+msg.author.username+"**-senpai.",function(error, sentMessage){bot.deleteMessage(sentMessage, {"wait": 5000})});}
		}
	},
  "anime": {
		usage: "Prints out information about the mentioned anime\n`anime [anime title]`",
    cooldown: 5,
		process: function (bot, msg, suffix) {
			var anime = msg.content.split(" ").slice(1).join("+");
			var apiURL = "http://myanimelist.net/api/anime/search.xml?q=" + anime;
      var user = options.MAL_user, pass = options.MAL_pass;
			request(apiURL, {"auth": {"user": user,"pass": pass,"sendImmediately": true}},
			function (error, response, body) {
				if (error) {console.log(errorC(error));}
				if (!error && response.statusCode == 200) {
					xml2js.parseString(body, function (err, result) {
						var animeArray = [];
						var synopsis = result.anime.entry[0].synopsis.toString();
						synopsis = synopsis.replace(/<br \/>/g, " ");
						synopsis = synopsis.replace(/\[(.{1,10})\]/g, "");
						synopsis = synopsis.replace(/\r?\n|\r/g, " ");
						synopsis = synopsis.replace(/\[(i|\/i)\]/g, "*");
						synopsis = synopsis.replace(/\[(b|\/b)\]/g, "**");
						synopsis = fix.decodeHTML(synopsis);
						if (synopsis.length > 1000) { synopsis = synopsis.substring(0, 1000); synopsis += "...";}
						animeArray.push("__**" + result.anime.entry[0].title + "**__ - __**" + result.anime.entry[0].english + "**__ • *" + result.anime.entry[0].start_date + "*  to *" + result.anime.entry[0].end_date + "*\n");
						animeArray.push("**Type:** *" + result.anime.entry[0].type + "*  **Episodes:** *" + result.anime.entry[0].episodes + "*  **Score:** *" + result.anime.entry[0].score + "*");
						animeArray.push(synopsis);
            animeArray.push("<http://myanimelist.net/anime/"+result.anime.entry[0].id+"/>")
						bot.sendMessage(msg, animeArray);
					});
				}
				else {bot.sendMessage(msg, "No anime found for: \"**" + suffix + "**\"",function(error, sentMessage){bot.deleteMessage(sentMessage, {"wait": 5000})});}
			});
		}
	},
	"manga": {
		usage: "Prints out information about the mentioned manga\n`manga [manga title]`",
    cooldown: 5,
		process: function (bot, msg, suffix) {
			var manga = msg.content.split(" ").slice(1).join("+");
			var apiURL = "http://myanimelist.net/api/manga/search.xml?q=" + manga;
      var user = options.MAL_user, pass = options.MAL_pass;
			request(apiURL, {"auth": {"user": user,"pass": pass,"sendImmediately": true}},
			function (error, response, body) {
				if (error) {console.log(errorC(error));}
				if (!error && response.statusCode == 200) {
					xml2js.parseString(body, function (err, result) {
						var mangaArray = [];
						var synopsis = result.manga.entry[0].synopsis.toString();
						synopsis = synopsis.replace(/<br \/>/g, " ");
						synopsis = synopsis.replace(/\[(.{1,10})\]/g, "");
						synopsis = synopsis.replace(/\r?\n|\r/g, " ");
						synopsis = synopsis.replace(/\[(i|\/i)\]/g, "*");
						synopsis = synopsis.replace(/\[(b|\/b)\]/g, "**");
						synopsis = fix.decodeHTML(synopsis);
						if (synopsis.length > 1000) { synopsis = synopsis.substring(0, 1000); synopsis += "...";}
						mangaArray.push("__**" + result.manga.entry[0].title + "**__ - __**" + result.manga.entry[0].synonyms + "**__ • *" + result.manga.entry[0].start_date + "*  to *" + result.manga.entry[0].end_date + "*\n");
						mangaArray.push("**Type:** *" + result.manga.entry[0].type + "*  **Chapters:** *" + result.manga.entry[0].chapters + "*  **Volumes:** *"+result.manga.entry[0].volumes+"*  **Score:** *" + result.manga.entry[0].score + "*");
            mangaArray.push("<http://myanimelist.net/manga/"+result.manga.entry[0].id+"/>")
						mangaArray.push(synopsis);
						bot.sendMessage(msg, mangaArray);
					});
				}
				else {bot.sendMessage(msg, "No manga found for: \"**" + suffix + "**\"", function(error, sentMessage){bot.deleteMessage(sentMessage, {"wait": 5000})});}
			});
		}
	},
  "weather": {
		usage: "Prints out weather information for the mentioned place. Sometimes a country is requires to work properly\n`weather [location]`",
    cooldown: 5,
		process: function (bot, msg, suffix) {
      if(!suffix) suffix = "Toronto";
      suffix = suffix.replace(" ", "");
      var rURL = (/\d/.test(suffix) == false) ? "http://api.openweathermap.org/data/2.5/weather?q=" + suffix + "&APPID=" + options.weather_api_key : "http://api.openweathermap.org/data/2.5/weather?zip=" + suffix + "&APPID=" + options.weather_api_key;
      request(rURL, function (error, response, weath) {
        if (!error && response.statusCode == 200) {
          weath = JSON.parse(weath);
					if (!weath.hasOwnProperty("weather")) {return;}
					var weatherC = ":sunny:";
					if ((weath.weather[0].description.indexOf("rain") > -1) || (weath.weather[0].description.indexOf("drizzle") > -1)) {weatherC = "☔";}
					else if (weath.weather[0].description.indexOf("snow") > -1) {weatherC = ":snowflake:";}
					else if (weath.weather[0].description.indexOf("clouds") > -1) {weatherC = ":cloud:";}
					else if (weath.weather[0].description.indexOf("storm") > -1) {weatherC = "⚡";}
					var direction = Math.floor((weath.wind.deg / 22.5) + 0.5)
					var compass = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
					var msgArray = [];
					var sunrise = new Date(weath.sys.sunrise * 1000)
					var formattedSunrise = (sunrise.getHours()) + ':' + ("0" + sunrise.getMinutes()).substr(-2)
					var sunset = new Date(weath.sys.sunset * 1000)
					var formattedSunset = (sunset.getHours()) + ':' + ("0" + sunset.getMinutes()).substr(-2)
					msgArray.push("🌎 __**Weather for " + weath.name + ", " + weath.sys.country + ":**__ • (*" + weath.coord.lon + ", " + weath.coord.lat + "*)")
					msgArray.push("**" + weatherC + "Current Weather Conditions:** " + weath.weather[0].description)
					msgArray.push("**:sweat: Humidity:** " + weath.main.humidity + "% - **🌆 Current Temperature:** " + Math.round(weath.main.temp - 273.15) + "°C / " + Math.round(((weath.main.temp - 273.15) * 1.8) + 32) + "°F")
					msgArray.push("**:cloud: Cloudiness:** " + weath.clouds.all + "% - **💨 Wind Speed:** " + weath.wind.speed + " m/s [*" + compass[(direction % 16)] + "*]")
					msgArray.push("**🌄 Sunrise:** " + formattedSunrise + " UTC / **🌇 Sunset:** " + formattedSunset + " UTC")
          bot.sendMessage(msg, msgArray);
        }
        else {console.log(errorC(error)); bot.sendMessage(msg, "There was an error getting the weather, please try again later.",function(error, sentMessage){bot.deleteMessage(sentMessage, {"wait": 5000})});}
      });
    }
	},
  "image": {
		usage: "Searches Imgur for an image with the mentioned terms and if no term is mentioned, Onee-chan is searched. If a subreddit is mentioned in the format `/r/[subreddit]` images from that subreddit will be returned. NSFW images will be ignored unless `--nsfw` is used\
    \n`image [term] or /r/[subreddit], <top> or <day> or <week> or <month> or <year> or <all>, <page #> <--nsfw>`",
    delete: true,
    cooldown: 5,
		process: function (bot, msg, suffix) {
      var xxx = false;
			var response = {};
      var query = "Onee-chan";
      var sort = "top";
      var page = 0;
      if(suffix.split(",")[0]) query = suffix.split(",")[0];
      if(suffix.split(",")[1]){
        var temp = suffix.split(",")[1].replace(/ /g, "");
        if(temp === "top") sort = "top";
        else if (temp === "day") sort = "day";
        else if (temp === "week") sort = "week";
        else if (temp === "month") sort = "month";
        else if (temp === "year") sort = "year";
        else if (temp === "all") sort = "all";
      }
			if(query.indexOf("--nsfw") > -1){xxx = true; query = query.replace(" --nsfw","");}
      if(query.startsWith("/r/")){
        query = query.replace(" ","_");
				var apiURL = "https://api.imgur.com/3/gallery"+query+"/"+sort+"/";
        get_image(bot, msg, apiURL, xxx, query);
      }
      else{

    			if(suffix.split(",")[2]){
    				var temp = suffix.split(",")[2].replace(/ /g, "");
    				if(/^\d+$/.test(temp)) page = temp;
    			}
    			var apiURL = "https://api.imgur.com/3/gallery/search/"+sort+"/"+page+"/?q="+query;
          get_image(bot, msg, apiURL, xxx, query);
        }
      }
    }
}

function get_image(bot, msg, apiURL, xxx, query)
{
  request({url: apiURL, headers: {'Authorization': 'Client-ID ' + imugr_id}}, (error, result, body) => {
    if(error){
      console.log(errorC(error));
      bot.sendMessage(msg, "I'm sorry **"+msg.author.username+"**-senpai there was an error: ```"+error+"```");
    }
    else if (result.statusCode != 200) {
      bot.sendMessage(msg, "I'm sorry **"+msg.author.username+"**-senpai but I got the status code ```"+result.statusCode);
    }
    else if (body) {
      body = JSON.parse(body);
      if(body.hasOwnProperty("data") && body.data.length !== 0){
        response = body.data[Math.floor(Math.random() * (body.data.length))];
        var postedDate = new Date(0); var temp = "";
      	if(response.link != undefined)
      	{
      		if(response.nsfw === true && xxx === false){bot.sendMessage(msg, "Your search for "+query+" was deemed to be too lewd, Senpai\nPlease use the tag `--nsfw` to get nsfw images\nhttp://i.imgur.com/jKLnvR7.png"); return;}
      		postedDate.setUTCSeconds(response.datetime)
      		if(response.description != null){temp = "\nDescription: "+response.description; temp = temp.replace(/.*?:\/\//g, "");}
      		bot.sendMessage(msg,"I searched Imgur for **\""+query+"\"** and found this, **"+msg.author.username+"**-senpai:\n```ruby\nTitle: "+response.title+""+temp+"\nDate Created: "+postedDate.toUTCString()+"```"+response.link);
      	}
      	else{bot.sendMessage(msg,"I'm sorry but that search for \"**"+query+"**\" did not get any results, **"+msg.author.username+"**-senpai", function(error, sentMessage){bot.deleteMessage(sentMessage, {"wait": 5000})});}
      }
      else{
        bot.sendMessage(msg,"**"+msg.author.username+"**-senpai, I'm sorry but that search for \"**"+query+"**\" did not get any results.", function(error, sentMessage){bot.deleteMessage(sentMessage, {"wait": 5000})});}
      }
    });
}

function get_gif(tags, bot, msg, func) {
	var params = {"api_key": "dc6zaTOxFJmzC", "rating": "r", "format": "json","limit": 1 };
	var query = qs.stringify(params);
	if (tags !== null) {query += "&tag=" + tags.join('+')}
	var request = require("request");
	request("http://api.giphy.com/v1/gifs/random?" + query, function (error, response, body) {
		if (error || response.statusCode !== 200) {bot.sendMessage(msg, "There was an error getting a gif", function(error, sentMessage){bot.deleteMessage(sentMessage, {"wait": 5000})});console.log(errorC(error));}
		else {var responseObj = JSON.parse(body); func(responseObj.data.id);}
	}.bind(this));
}

function rssfeed(bot, msg, url, count, full) {
	var FeedParser = require('feedparser');
	var feedparser = new FeedParser();
	var request = require('request');
	request(url).pipe(feedparser);
	feedparser.on('error', function (error) {console.log(errorC(error));});
	var shown = 0;
	feedparser.on('readable', function () {
		var stream = this;
		shown += 1
		if (shown > count) {return;}
		var item = stream.read();
		if(url === "https://www.reddit.com"){url = "https://www.reddit.com/r/all/","";}
		bot.sendMessage(msg,"I got the top post of **\""+url.replace(".rss","").replace("https://www.reddit.com","")+"\"** for you, **"+msg.author.username+"**-senpai: \n" + item.link);
		stream.alreadyRead = true;
	});
}

exports.searches = searches;
