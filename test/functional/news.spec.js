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
   * A helper for creating a News test data.
   */
  async function createNewsRecord() {
    const payload = {
      "title": "Article 1",
      "content": "<p> This is the content of Article 1. </p>",
      "author": "Wendy Sanarwanto <wendy.sanarwanto@gmail.com>",
      "status": "draft",
      "publishDate": "2018-03-03T04:28:07.444Z"
    };
    const createNewsApiUrl = `${API_HOST_URL}${NEWS_API_PATH}`;
    const existingNews = await doApiRequest(createNewsApiUrl, 'POST', payload);
    newsIdsToCleanup.push(existingNews.id);
    return existingNews;
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
    const failErrMessage = "Should returns error.";

    try {
      // Act
      await doApiRequest(apiUrl, 'POST', news);
      assert.fail(failErrMessage);
    } catch (err) {
      // Assert
      assert.notEqual(err.message, failErrMessage);
      assert.ok(err);
      assert(err.error.error.statusCode, 422);
    }
  });

  it(`updates an existing 'News' record's attributes by id`, async() => {
    // Arrange
    const existingNews = await createNewsRecord();
    const existingNewsId = existingNews.id;

    const updateApiUrl = `${API_HOST_URL}${NEWS_API_PATH}/${existingNewsId}`;
    existingNews.title = "Article A";
    existingNews.status = "publish";

    // Act
    const response = await doApiRequest(updateApiUrl, "PATCH", existingNews);

    // Assert
    assert.ok(response);
    assert.equal(response.title, existingNews.title);
    assert.equal(response.status, existingNews.status);
  });

  it(`gets error when attempting on updating an existing 'News' record's \`status\` to invalud value`, async() => {
    // Arrange
    const existingNews = await createNewsRecord();
    const existingNewsId = existingNews.id;

    const updateApiUrl = `${API_HOST_URL}${NEWS_API_PATH}/${existingNewsId}`;
    existingNews.status = "updated";
    const failErrMessage = `Updating a News record's status to invalid value should gets error.`;

    try{
      // Act
      await doApiRequest(updateApiUrl, "PATCH", existingNews);
      assert.fail(failErrMessage);
    } catch(err) {
      // Assert
      assert.notEqual(err.message, failErrMessage);
      assert.ok(err);
      assert(err.error.error.statusCode, 400);
    }
  });
  
});
