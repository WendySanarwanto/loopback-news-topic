'use strict';

const rp = require('request-promise');

/**
 * A helper for sending REST API Request.
 * @param {*} apiUrl The API Endpoint's URL.
 * @param {*} method The HTTP Request's method (e.g. POST, GET, DELETE, PUT).
 * @param {*} payload The request payload in JSON object.
 */
function doApiRequest(apiUrl, method, payload) {
  const body = payload;
  const options = {
    method: method,
    uri: apiUrl,
    json: true
  };

  if (payload) {
    options.body = body;
  }

  return rp(options);
}

exports.doApiRequest = doApiRequest;