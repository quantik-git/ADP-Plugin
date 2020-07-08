// URL albion 2d
const API_URL = "https://www.albion-online-data.com/api/v2/stats/";

/*
* parseValue
* param {object} Json object
* param {array}  Keys to parse from the object
* return {array} Array of relevant keys 
*/
function parseValue(object, keys) {
  
  return object.map(function(e) {
    return keys.map(function(key) {
      return e[key];
    });
  });
}

/*
* timeSince converts timestamp to "unitOfTime ago"
* param  {date}   Linux timestamp
* return {string} Array of relevant keys 
*/
function timeSince(date) {
  var seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  var secondsInUnitOfTime = [31536000, 2592000, 86400, 3600, 60, 1];
  var timeUnit = ["year", "month", "day", "hour", "min", "second"];
  
  for (i = 0; i < secondsInUnitOfTime.length; i++) {
    var interval = Math.floor(seconds / secondsInUnitOfTime[i]);
    
    if (interval == 1) {
      return interval + " " + timeUnit[i] + " ago";
    } else if (interval > 1) {
      return interval + " " + timeUnit[i] + "s ago";
    }
  }
}


/**
 * Item Sell Price.
 * 
 * @param {string} Items to search for.
 * @param {string} Markets to search in.
 * @param {string} Quality of the item(s) of the search.
 * @param {bool}   Include timestamp or not(the default is true).
 * @return {array} The price(and timestamp)
 * @customfunction
 */
function getSellPrice(items, locations, qualities = null, timestamp = true) {
  var url = API_URL + "prices/" + items + "?locations=" + locations + "&qualities=" + qualities;
  var object = fetchJSON(url);
  
  return (timestamp) ?
      parseValue(object, ["sell_price_min", "sell_price_min_date"]) :
      parseValue(object, ["sell_price_min"]);
}

/**
 * Item Buy Price.
 * 
 * @param {string} Items to search for.
 * @param {string} Markets to search in.
 * @param {string} Quality of the item(s) of the search.
 * @param {bool}   Include timestamp or not(the default is true).
 * @return {array} Table with data
 * @customfunction
 */
function getBuyPrice(items, locations, qualities = null, timestamp = true) {
  var url = API_URL + "prices/" + items + "?locations=" + locations + "&qualities=" + qualities;
  var object = fetchJSON(url);
  
  var fields = ["buy_price_max"];
  if (timestamp) fields.push("buy_price_max_date");
  
  return parseValue(object, fields);
}


/**
 * Get the latest X gold prices.
 * 
 * @param {string} Items to search for.
 * @param {bool}   Include timestamp or not(the default is true).
 * @return {array} The price(and timestamp)
 * @customfunction
 */
function getGoldPrice(count, timestamp = true) {
  var url = API_URL + "gold?count=" + count;
  
  var object = fetchJSON(url);
  
  return (timestamp) ?
      parseValue(object, ["price", "timestamp"]) :
      parseValue(object, ["price"]);
}

/**
 * Get all gold prices since the supplied date.
 * 
 * @param {integer} Day of month.
 * @param {integer} Month.
 * @param {integer} Year(default 2020).
 * @param {bool}    Include timestamp or not(default is true).
 * @return {array}  The price(and timestamp)
 * @customfunction
 */
function getGoldPriceDate(day, month, year = 2020, timestamp = true) {
  var url = API_URL + "gold?date=" + month + "-" + day + "-" + year;
  
  var object = fetchJSON(url);
  
  return (timestamp) ?
      parseValue(object, ["price", "timestamp"]) :
      parseValue(object, ["price"]);
}


/**
 * Get item average price and amount over time.
 * 
 * @param {string}  Item to search for.
 * @param {string}  Market to search in.
 * @param {string}  Quality of the item(s) of the search.
 * @param {integer} Time scale of the data in hours (defualt every 6 hours).
 * @return {array}  Table with data
 * @customfunction
 */
function getHistory(item, location, qualities, timescale = 6) {
  var url = API_URL + "history/" + item + "?locations=" + location + "&qualities=" + qualities + "&time-scale=" + timescale;
  
  var object = fetchJSON(url);
  
  var values = object[0].data.map(function(e) {
    return [e.item_count, e.avg_price, timeSince(e.timestamp)];
  });
  
  return values.reverse();
}
