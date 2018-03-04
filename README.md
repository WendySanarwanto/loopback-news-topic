# loopback-news-topic
REST API endpoints, built on Loopback.io framework which provide News &amp; Topic REST API Data services.

## 1. How to run the Application in Local Machine

* Ensure that you have installed these software in your local machine:
    * [Docker](https://docs.docker.com/install/)
    * [Node.js](https://nodejs.org/en/)  version 9.7.1 or version 8.9.4 LTS.
    * [Git client](https://git-scm.com/downloads)

* Open a Command Line Interface (CLI) terminal, and clone this repository through running `git clone https://github.com/WendySanarwanto/loopback-news-topic.git` command.

* On the command prompt, change directory to the location of cloned repository then run `npm install` command for installing required dependency libraries.

* If your local machine has no MongoDb installed or running, start the mongodb container through running `npm run mongodb` command. To stop the mongodb container, you could run `npm run mongodb:stop` command to do this. Next time you want to run the MongoDB container, you could run `npm run mongodb:start` command, instead of running `npm run mongodb` command.

* To Start the REST API backend application, run `npm run start` command. Then, the Application runs on port 3000 and the API Endpoints are accessible on `/api` path. Example: `GET` `News` API endpoint is accessible on this url: http://localhost:3000/api/News

* The backend application has Swagger API Documentation page that can be accessed for testing/playing around with the running API. To access the swagger page, open your browser then browse to http://localhost:3000/explorer. 

## 2. About Testing

### 2.1. Location of Test files
We placed all of test files in the `test` directory. These test files are explained as follows:

* `ACCEPTANCE_TEST.md` - Contains acceptance test scenarios, where each of written test scenario are detailed as in BDD (Given-When-Then) statements. This acceptance test plan is used as a reference by the functional tests and also can be used as reference for manual testig or other kind of testings in future (e.g. Contract Testing). 

* `functional` directory - This directory contains all functional testing files where they are executable by Mocha test runner: 

    * `news.spec.js` file contains testing methods which test the behaviour of `News` API.

    * `topic.spec.js` file contains testing methods which test the behaviour of `Topic` API.

    * `news-topics.spec.js` file contains testing methods which test `Many-to-Many` behaviour between `News` & `Topics` models.

* `lib` directory - contains helper methods that are used by the functional test files.

### 2.2. How to run functional test against Application running on local machine

* Ensure that you have installed required softwares as mentioned in __section 1__ and followed instructions described in that section.

* Open a terminal window, change directory to the location of this application and start the application through running `npm run start` command.

* Open another terminal window, stay inside this application's directory and then start the functional testing through running `npm run test` command.

### 2.3. How to run functional test against Application hosted on remote machine
**TBD**

## 3. Example usages of the API
Below are several examples of how you could use the API within your application:

* Display a list of published News

        curl -X GET --header 'Accept: application/json' 'http://YOUR_API_HOST_URL/api/News?filter={"where": {"status": "publish"}}'

* Display a list of both published and draft News

        curl -X GET --header 'Accept: application/json' 'http://YOUR_API_HOST_URL/api/News?filter={ "where": { "or": [{"status": "draft"}, {"status": "publish"}] }}'

* Display a list of all Topics

        curl -X GET --header 'Accept: application/json' 'http://YOUR_API_HOST_URL/api/Topics' 

* Display a list of all Topics associated to a News

        curl -X GET --header 'Accept: application/json' 'http://YOUR_API_HOST_URL/api/News/5a9c07bcac899f22981588d7/topics'

Rest of usage scnearios can be looked inside `test/ACCEPTANCE_TEST.md` document.

## 4. Deployment to remote machine
**TBD**

