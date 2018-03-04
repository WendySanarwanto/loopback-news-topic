'use strict';

const assert = require('assert');
const rp = require('request-promise');
const doApiRequest = require(`../lib/test-utility`).doApiRequest;

// TODO: Figure out a way to parameterise this
const API_HOST_URL = 'http://localhost:3000/api';
const NEWS_API_PATH = '/News';
const TOPICS_API_PATH = '/Topics';

describe(`NewsTopics Many-to-Many`, ()=>{
  const newsIdsToCleanup = [];
  const topicIdsToCleanup = [];
  const topicNewsIdsToCleanUp = [];
    
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

  async function cleanupTopicNewsRecords() {
    while(topicNewsIdsToCleanUp.length > 0){
      const newsTopic = topicNewsIdsToCleanUp.pop();
      let apiUrl = `${API_HOST_URL}${NEWS_API_PATH}/${newsTopic.newsId}${TOPICS_API_PATH}/rel/${newsTopic.topicId}`;
      await doApiRequest(apiUrl,'DELETE');
    };
  }

  async function associateTopicsToNews(topics, news) {
    for(const topic of topics) {
      const apiUrl = `${API_HOST_URL}${NEWS_API_PATH}/${news.id}${TOPICS_API_PATH}/rel/${topic.id}`;
      const response = await doApiRequest(apiUrl,"PUT");
      topicNewsIdsToCleanUp.push(response);
    }
  }

  async function associateNewsListToTopic(newsList, topic) {
    for(const news of newsList){
      const apiUrl = `${API_HOST_URL}${TOPICS_API_PATH}/${topic.id}${NEWS_API_PATH}/rel/${news.id}`;
      const response = await doApiRequest(apiUrl, "PUT");
      topicNewsIdsToCleanUp.push(response);
    }
  }

  /**
   * Do cleaning up after each tests are executed.
   */
  afterEach(async () => {
    // Cleanup test data
    await cleanupTopicNewsRecords();
    await cleanupNewsRecords();
    await cleanupTopicRecords();
  });

  it(`updates existing 'News' record by associating it with existing 'Topic' records.`, async () => {
    // Arrange
    const topics = await createTopicTestData();
    const news = await createNewsRecord();

    // Act
    await associateTopicsToNews(topics, news);

    // Assert
    assert.ok(Array.isArray(topicNewsIdsToCleanUp));
    assert.ok(topicNewsIdsToCleanUp.length > 0);
    for(let i=0; i < topicNewsIdsToCleanUp.length; i++) {
      assert.equal(topicNewsIdsToCleanUp[i].newsId, news.id);
      assert.equal(topicNewsIdsToCleanUp[i].topicId, topics[i].id);
    }
  });

  it(`gets all 'Topic' records associated to a News.`, async() => {
    // Arrange
    const topics = await createTopicTestData();
    const news = await createNewsRecord();
    await associateTopicsToNews(topics, news);
    
    const apiUrl = `${API_HOST_URL}${NEWS_API_PATH}/${news.id}${TOPICS_API_PATH}`;

    // Act
    const response = await doApiRequest(apiUrl, "GET");

    // Assert
    assert.ok(Array.isArray(response));
    assert.ok(response.length > 0);
    assert.deepEqual(response, topics);
  });

  it(`updates existing 'Topic' record by associating it with existing 'News' records.`, async() => {
    // Arrange
    const newsList = await createNewsTestRecords();
    const topic = await createTopicRecord();

    // Act
    await associateNewsListToTopic(newsList, topic);

    // Assert
    assert.ok(Array.isArray(topicNewsIdsToCleanUp));
    assert.ok(topicNewsIdsToCleanUp.length > 0);
    for(let i=0; i < topicNewsIdsToCleanUp.length; i++) {
      assert.equal(topicNewsIdsToCleanUp[i].newsId, newsList[i].id);
      assert.equal(topicNewsIdsToCleanUp[i].topicId, topic.id);
    }
  });

  it(`gets all 'News' records associated to a 'Topic'.`, async() => {
    // Arrange
    const topic = await createTopicRecord();
    const newsList = await createNewsTestRecords();
    await associateNewsListToTopic(newsList, topic);

    const apiUrl = `${API_HOST_URL}${TOPICS_API_PATH}/${topic.id}${NEWS_API_PATH}`;

    // Act
    const response = await doApiRequest(apiUrl, "GET");

    // Assert
    assert.ok(Array.isArray(response));
    assert.ok(response.length > 0);
    assert.deepEqual(response, newsList);
  });
});
