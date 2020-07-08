/**
 * Fetches JSON object from url.
 * 
 * @param {string} Url for the request.
 * @return {object} Javascript JSON object
 * @customfunction
 */
function fetchJSON(url) {
  var response = UrlFetchApp.fetch(url);
  return JSON.parse(response.getContentText());
}

/**
 * Renders JSON.
 * 
 * @param {string} Url for the request.
 * @return {array} Table with data
 * @customfunction
 */
function renderJSON(url) {
  var object = fetchJSON(url);

  var headers = Object.keys(object[0]);
  var values = object.map(function(e) {
    return headers.map(function(f) {
      return e[f]
    })
  });
  values.unshift(headers);

  return values;
}
