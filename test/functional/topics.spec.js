'use strict';

const assert = require('assert');
const rp = require('request-promise');
const doApiRequest = require(`../lib/test-utility`).doApiRequest;

// TODO: Figure out a way to parameterise this
const API_HOST_URL = 'http://localhost:3000/api';
const TOPICS_API_PATH = '/Topics';

describe('Topic API', () => {
  const topicIdsToCleanup = [];

  /**
   * A helper for cleaning up queued test data.
   */
  async function cleanupTopicRecords() {
    while(topicIdsToCleanup.length > 0) {
      const id = topicIdsToCleanup.pop();
      let apiUrl = `${API_HOST_URL}${TOPICS_API_PATH}/${id}`;      
      await doApiRequest(apiUrl, 'DELETE');
    }
  }

  /**
   * A helper for creating a Topic test data.
   */
  async function createTopicRecord() {
    const apiUrl = `${API_HOST_URL}${TOPICS_API_PATH}`;
    const topic = {
      "title": "Breaking News",
      "thumbnailUrl": "s3://lb_news_topic/topic/breaking_news.png"
    };

    const createdTopic = await doApiRequest(apiUrl, 'POST', topic);
    topicIdsToCleanup.push(createdTopic.id);

    return createdTopic;
  }

  async function createTopicTestData() {
    const apiUrl = `${API_HOST_URL}${TOPICS_API_PATH}`;
    const topics = [{
      "title": "News",
      "thumbnailUrl": "s3://lb_news_topic/topic/news.png"
    }, {
      "title": "Breaking News",
      "thumbnailUrl": "s3://lb_news_topic/topic/breaking_news.png"
    }, {
      "title": "Sports",
      "thumbnailUrl": "s3://lb_news_topic/topic/sports.png"
    }];

    const createdTopics = await doApiRequest(apiUrl, 'POST', topics);
    for(const topic of createdTopics) {
      topicIdsToCleanup.push(topic.id);
    }

    return createdTopics;
  }

  /**
   * Do cleaning up after each tests are executed.
   */
  afterEach(async () => {
    // Cleanup test data
    await cleanupTopicRecords();
  });

  it(`creates a new 'Topic' record.`, async() => {
    // Arrange
    const apiUrl = `${API_HOST_URL}${TOPICS_API_PATH}`;
    const topic = {
      "title": "Breaking News",
      "thumbnailUrl": "s3://lb_news_topic/topic/breaking_news.png"
    };

    // Act
    const response = await doApiRequest(apiUrl, 'POST', topic);

    // Assert
    assert.ok(response);
    assert.equal(response.title, topic.title);
    assert.equal(response.thumbnailUrl, topic.thumbnailUrl);
    topicIdsToCleanup.push(response.id);
  });

  it(`gets error when attempting on creating a new 'Topic' record with missing 'title'.`, async()=> {
    // Arrange
    const apiUrl = `${API_HOST_URL}${TOPICS_API_PATH}`;
    const topic = {
      "thumbnailUrl": "s3://lb_news_topic/topic/breaking_news.png"
    };
    const failErrMessage = "Should returns error.";

    try { 
      // Act
      await doApiRequest(apiUrl, 'POST', topic);
      assert.fail(failErrMessage);
    } catch(err) {
      // Assert
      assert.notEqual(err.message, failErrMessage);
      assert.ok(err);
      assert(err.error.error.statusCode, 422);
    }
  });

  it(`updates an existing 'Topic' record's attribute by id`, async() => {
    // Arrange
    const createdTopic = await createTopicRecord();
    const apiUrl = `${API_HOST_URL}${TOPICS_API_PATH}`;

    // Act
    const response = await doApiRequest(apiUrl, "GET");

    // Assert
    assert.ok(response);
    assert.ok(response.length > 0);
    assert.equal(response[0].title, createdTopic.title);
    assert.equal(response[0].thumbnailUrl, createdTopic.thumbnailUrl);
  });

  it(`gets 'Topic' records which have title containing specific word.`, async() => {
    // Arrange
    const word = "News";
    const topicRecords = (await createTopicTestData()).filter(topic => topic.title.includes(word));
    const filterParams = `?[filter][where][title][like]=${word}`;
    const apiUrl = `${API_HOST_URL}${TOPICS_API_PATH}${filterParams}`;

    // Act
    const response = await doApiRequest(apiUrl, "GET");

    // Assert
    assert.deepEqual(response, topicRecords);
  });

  it(`gets a 'Topic' record by specified 'id'.`, async() => {
    // Arrange
    const createdTopic = await createTopicRecord();
    const apiUrl = `${API_HOST_URL}${TOPICS_API_PATH}/${createdTopic.id}`;

    // Act
    const response = await doApiRequest(apiUrl, "GET");

    // Assert
    assert.deepEqual(response, createdTopic);
  });
});