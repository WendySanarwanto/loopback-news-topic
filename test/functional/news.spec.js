'use strict';

const assert = require('assert');
const rp = require('request-promise');

// TODO: Figure out a way to parameterise this
const API_HOST_URL = 'http://localhost:3000/api';
const NEWS_API_PATH = '/News';

describe('News API', () => {
  const newsIdsToCleanup = [];

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

  /**
   * A helper for cleaning up queued test data.
   */
  async function cleanupNewsRecords() {
    let apiUrl = `${API_HOST_URL}${NEWS_API_PATH}`;
    while(newsIdsToCleanup.length > 0) {
      const id = newsIdsToCleanup.pop();
      apiUrl = `${apiUrl}/${id}`;
      await doApiRequest(apiUrl, 'DELETE');
    }
  }

  /**
   * Do cleaning up after each tests are executed.
   */
  afterEach(async () => {
    // Cleanup test data
    await cleanupNewsRecords();
  });

  it(`creates a new 'News' record`, async () => {
    // Arrange
    const apiUrl = `${API_HOST_URL}${NEWS_API_PATH}`;
    const news = {
      "title": "Article 1",
      "content": "<p> This is the content of Article 1. </p>",
      "author": "Wendy Sanarwanto <wendy.sanarwanto@gmail.com>",
      "status": "draft",
      "publishDate": "2018-03-03T04:28:07.444Z"
    };

    // Act
    const response = await doApiRequest(apiUrl, 'POST', news);

    // Assert
    assert.ok(response);
    assert.equal(news.title, response.title);
    assert.equal(news.content, response.content);
    assert.equal(news.author, response.author);
    assert.equal(news.status, response.status);
    assert.equal(news.publishDate, response.publishDate);
    newsIdsToCleanup.push(response.id);
  });

  it(`gets error when attempting on creating a 'News' with missing mandatory parameter(s)`, async () => {
    // Arrange
    const apiUrl = `${API_HOST_URL}${NEWS_API_PATH}`;
    const news = {
      "title": "Article 1",
      "status": "draft",
    };

    try {
      // Act
      await doApiRequest(apiUrl, 'POST', news);
      assert.fail("Should returns error.");
    } catch (err) {
      // Assert
      assert(err);
      assert(err.error.error.statusCode, 422);
    }
  });

  
});
