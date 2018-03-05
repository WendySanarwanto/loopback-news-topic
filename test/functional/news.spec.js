'use strict';

const assert = require('assert');
const rp = require('request-promise');
const doApiRequest = require(`../lib/test-utility`).doApiRequest;

// TODO: Figure out a way to parameterise this
const API_HOST_URL = 'http://localhost:3000/api';
const NEWS_API_PATH = '/News';

describe('News API', () => {
  const newsIdsToCleanup = [];

  /**
   * A helper for cleaning up queued test data.
   */
  async function cleanupNewsRecords() {
    while(newsIdsToCleanup.length > 0) {
      const id = newsIdsToCleanup.pop();
      let apiUrl = `${API_HOST_URL}${NEWS_API_PATH}/${id}`;      
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
   * A helper for creating a number of News records.
   */
  async function createNewsTestRecords() {
    const payload = [{
      "title": "Draft Article 1",
      "content": "<p> This is the content of Article 1. </p>",
      "author": "Wendy Sanarwanto <wendy.sanarwanto@gmail.com>",
      "status": "draft",
      "publishDate": "2018-03-03T04:28:07.444Z"
    }, {
      "title": "Draft Article 2",
      "content": "<p> This is the content of Article 2. </p>",
      "author": "Wendy Sanarwanto <wendy.sanarwanto@gmail.com>",
      "status": "draft",
      "publishDate": "2018-03-03T04:28:07.444Z"
    }, {
      "title": "Published Article 3",
      "content": "<p> This is the content of Article 3. </p>",
      "author": "Lisa Huang <lisa.huang@gmail.com>",
      "status": "publish",
      "publishDate": "2018-03-03T04:28:07.444Z"
    }, {
      "title": "Published Article 4",
      "content": "<p> This is the content of Article 4. </p>",
      "author": "Diana Prince <diana.prince@gmail.com>",
      "status": "publish",
      "publishDate": "2018-03-03T04:28:07.444Z"
    }];

    const createNewsApiUrl = `${API_HOST_URL}${NEWS_API_PATH}`;
    const existingNews = await doApiRequest(createNewsApiUrl, 'POST', payload);
    
    for(const news of existingNews) {
      newsIdsToCleanup.push(news.id);
    }

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
  
  it(`gets all existing 'News' records.`, async () => {
    // Arrange
    const newsTestRecords = await createNewsTestRecords();
    const apiUrl = `${API_HOST_URL}${NEWS_API_PATH}`;

    // Act
    const response = await doApiRequest(apiUrl, "GET");

    // Assert
    for(const news of newsTestRecords) {
      assert.ok(response.find(resp => resp.id === news.id) !== null);
    }
  });

  it(`gets all existing 'News' records which has status equal to \`draft\``, async () => {
    // Arrange
    const newsTestRecords = await createNewsTestRecords();
    const draftNews = newsTestRecords.filter(news => news.status === 'draft');
    const apiUrl = `${API_HOST_URL}${NEWS_API_PATH}?[filter][where][status]=draft`;

    // Act
    const response = await doApiRequest(apiUrl, "GET");

    // Assert
    for(const news of draftNews) {
      assert.ok(response.find(resp => resp.id === news.id) !== null);
    }
  });

  it(`gets all existing 'News' records which has status equal to \`publish\``, async () => {
    // Arrange
    const newsTestRecords = await createNewsTestRecords();
    const draftNews = newsTestRecords.filter(news => news.status === 'publish');
    const apiUrl = `${API_HOST_URL}${NEWS_API_PATH}?[filter][where][status]=publish`;

    // Act
    const response = await doApiRequest(apiUrl, "GET");

    // Assert
    assert.deepEqual(response, draftNews);
  });

  it(`gets existing 'News' records which are authored by specific name`, async() => {
    // Arrange
    const newsTestRecords = await createNewsTestRecords();
    const authorName = "Wendy Sanarwanto";
    const draftNews = newsTestRecords.filter(news => news.author.includes(authorName));
    const filterParams = `?[filter][where][author][like]=${authorName}`;
    const apiUrl = `${API_HOST_URL}${NEWS_API_PATH}${filterParams}`;

    // Act
    const response = await doApiRequest(apiUrl, "GET");

    // Assert
    for(const news of draftNews){
      assert.ok(response.find(resp => resp.id === news.id) !== null );
    }
    // assert.deepEqual(response, draftNews);
  });

  it(`gets existing 'News' records which have title containing specific words. `, async () => {
    // Arrange
    const newsTestRecords = await createNewsTestRecords();
    const draftNews = newsTestRecords.filter(news => news.title.includes('draft'));
    const filterParams = `?[filter][where][title][like]=draft`;
    const apiUrl = `${API_HOST_URL}${NEWS_API_PATH}${filterParams}`;

    // Act
    const response = await doApiRequest(apiUrl, "GET");

    // Assert
    assert.deepEqual(response, draftNews);
  });

  it(`gets a 'News' record by specified 'id'.`, async() => {
    // Arrange
    const newsRecord = await createNewsRecord();
    const apiUrl = `${API_HOST_URL}${NEWS_API_PATH}/${newsRecord.id}`;

    // Act
    const response = await doApiRequest(apiUrl, "GET");

    // Assert
    assert.deepEqual(response, newsRecord);
  });
});
