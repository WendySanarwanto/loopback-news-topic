# loopback-news-topic
REST API endpoints, built on Loopback.io framework which provide News &amp; Topic management services.

## How to run the Application in Local Machine

* Ensure that you have installed these software in your local machine:
    * [Docker](https://docs.docker.com/install/)
    * [Node.js](https://nodejs.org/en/)
    * [Git client](https://git-scm.com/downloads)

* Open a Command Line Interface (CLI) terminal, and clone this repository through running `git clone https://github.com/WendySanarwanto/loopback-news-topic.git` command.

* On the command prompt, change directory to the location of cloned repository then run `npm install` command for installing required dependency libraries.

* If your local machine has no MongoDb installed or running, start the mongodb container through running `npm run mongodb` command. To stop the mongodb container, you could run `npm run mongodb:stop` command to do this. Next time you want to run the MongoDB container, you could run `npm run mongodb:start` command, instead of running `npm run mongodb` command.

* To Start the REST API backend application, run `npm run start` command.

* The backend application has Swagger API Documentation page that can be accessed for testing/playing around with the running API. To access the swagger page, open your browser then browse to http://localhost:3000/explorer. 