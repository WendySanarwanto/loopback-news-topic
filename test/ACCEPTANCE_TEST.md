# Acceptance Test Scenarions
This document contains a list of acceptance test scenarios that are used as reference by functional test scripts and also can be used for testing the REST API backend application.

## News API's Test Scenarios

1. Create a new `News` record.

        Given a News record with valid values, need to be created
        When invoking `POST` /News API Endpoint with the News record
        Then calling the API returns 200 status 
          And the News record is saved in database with status equal to "draft". 

2. Attempt on creating a new `News` record with missing mandatory parameter should return error.

        Given a News record with one or more missing values, need to be created
        When invoking `POST` /News API Endpoint with the News record
        Then calling the API returns 422 status 
          And the News record is NOT saved in database. 

3. Update an existing `News` record's attributes by the record's id.

        Given a News record which has id equals to `5a9a5b5a3cfa8617c92ff10e`, does exist in the system
        When changed the News record's attributes with valid new values
          And invoking `PATCH` /News/5a9a5b5a3cfa8617c92ff10e API Endpoint with the modified News record
        Then calling the API returns 200 status 
          And the new values of News record is saved in database. 

4. Attempt on updating an existing `News` record's `status` to invalid value should return error.

        Given a News record which has id equals to `5a9a5b5a3cfa8617c92ff10e`, does exist in the system
          And the News record's status is set as `draft`
        When Changed the News record's status to `publish`
          And invoking `PATCH` /News/5a9a5b5a3cfa8617c92ff10e API Endpoint  with the modified News record
        Then calling the API returns 400 status 
          And the change is NOT saved in database. 

5. Get all existing `News` record.

        Given there are a number News records do exist in the system
          And these News records have various status such as `draft`, `delete` & `publish`
        When invoking `GET` /News API Endpoint
        Then calling the API returns 200 status 
          And the response contains an array of all of these existing News record(s). 

6. Get existing `News` records which has status equal to `draft`

        Given there are a number News records which have `draft` status, do exist in the system
        When invoking `GET` `/News?[filter][where][status]=draft` API Endpoint.
        Then calling the API returns 200 status 
          And the response contain an array of all of News record(s) which have `draft` status. 

7. Get existing `News` records which has status equal to `publish`

        Given there are a number News records which have `publish` status, do exist in the system
        When invoking `GET` `/News?[filter][where][status]=publish` API Endpoint.
        Then calling the API returns 200 status 
          And the response contain an array of all of News record(s) which have `publish` status. 


8. Get existing `News` records which are authored by specific name.

        Given there are a number News records which are authored by `Wendy Sanarwanto`, do exist in the system
        When invoking `GET` `/News?[filter][where][author][like]=Wendy Sanarwanto` API Endpoint.
        Then calling the API returns 200 status 
          And the response contain an array of all of News record(s) which are authored by `Wendy Sanarwanto`. 

9. Get `News` record(s) which its title contains specific word.

        Given there are a number News records which have title contains `Mobil` word, do exist in the system
        When invoking `GET` `/News?[filter][where][title][like]=Mobil` API Endpoint.
        Then calling the API returns 200 status 
          And the response contain an array of all of News record(s) which have title contains `Mobil` word. 

10. Get a `News` record by `id`.

        Given there is a News record which has id equal to `5a9a5b5a3cfa8617c92ff10e` exist in the system
        When invoking `GET` `/News/5a9a5b5a3cfa8617c92ff10e` API Endpoint.
        Then calling the API returns 200 status 
          And the response contain a News record that has id equals to `5a9a5b5a3cfa8617c92ff10e`. 

## Topic API's Test Scenarios

1. Create a new `Topic` record.

        Given a Topic record with valid values, need to be created
        When invoking `POST` /Topics API Endpoint with the Topic record
        Then calling the API returns 200 status 
          And the Topic record is saved in database. 

2. Attempt on creating a new `Topic` record with missing `title` should return error.

        Given a Topic record with one or more missing values, need to be created
        When invoking `POST` /Topics API Endpoint with the News record
        Then calling the API returns 422 status 
          And the Topic record is NOT saved in database. 

3. Update an existing `Topic` record's attributes by the record's id.

        Given a Topic record which has id equals to `5a9a5b5a3cfa8617c92ff10e`, does exist in the system
        When changed the Topic record's attributes with valid new values
          And invoking `PATCH` /Topics/5a9a5b5a3cfa8617c92ff10e API Endpoint with the modified News record
        Then calling the API returns 200 status 
          And the new values of Topic record is saved in database.

4. Get all existing `Topic` record.

        Given there are a number Topic records do exist in the system
        When invoking `GET` /Topics API Endpoint
        Then calling the API returns 200 status 
          And the responses contain an array of all of these existing Topic record(s).

5. Get `Topic` record(s) which its title contains specific word.

        Given there are 2 Topic records which have title `News` and `Breaking News`, do exist in the system
        When invoking `GET` `/Topics?[filter][where][title][like]=News` API Endpoint.
        Then calling the API returns 200 status 
          And the response contain an array of Topics record(s) which have title `News` & `Breaking News`. 

6. Get a `Topic` record by `id`.

        Given there is a Topic record which has id equal to `5a9adb572599ac1c04086386` exist in the system
        When invoking `GET` `/Topics/5a9adb572599ac1c04086386` API Endpoint.
        Then calling the API returns 200 status 
          And the response contain a Topic record that has id equals to `5a9adb572599ac1c04086386`. 

## Many to many Test Scenarios

1. Update an existing `News` record by associating it with 2 or more existing `Topic` records.

        Given there are 2 Topic records which have id: `5a9adb4f2599ac1c04086385` and `5a9adb572599ac1c04086386`
          And an existing News record which has id: `5a9aee3b2599ac1c0408638d`.
        When invoking `PUT` `/News/5a9aee3b2599ac1c0408638d/topics/rel/5a9adb4f2599ac1c04086385`
        Then calling the API returns 200 status 
          And the response body contains topicId=5a9adb4f2599ac1c04086385, newsId=5a9aee3b2599ac1c0408638d and id of NewsTopic record.
        When invoking `PUT` `/News/5a9aee3b2599ac1c0408638d/topics/rel/5a9adb572599ac1c04086386`
        Then calling the API returns 200 status 
          And the response body contains topicId=5a9adb572599ac1c04086386, newsId=5a9aee3b2599ac1c0408638d and id of NewsTopic record.

2. Get all `Topics` of a `News`

        Given is a `News` record with id='5a9ae2632599ac1c04086388'
          and the `News` record is associated to `Topics` with ids: `5a9ae2632599ac1c04086388` and `5a9aee3b2599ac1c0408638d`
        When invoking `GET` `/News/5a9ae2632599ac1c04086388` API endpoint
        Then calling the API returns 200 status 
          And the response body contains an array of these associated `Topics` by these ids: `5a9ae2632599ac1c04086388` and `5a9aee3b2599ac1c0408638d`

3. Update an existing `Topic` record by associating it with 2 or more existing `News` records.

        Given there are 2 News records which have id: `5a9ae2632599ac1c04086388` and `5a9aee3b2599ac1c0408638d`
          And an existing Topic record which has id: `5a9adb572599ac1c04086386`.
        When invoking `PUT` `/Topic/5a9adb572599ac1c04086386/news/rel/5a9ae2632599ac1c04086388`
        Then calling the API returns 200 status 
          And the response body contains topicId=5a9adb572599ac1c04086386, newsId=5a9ae2632599ac1c04086388 and id of NewsTopic record.
        When invoking `PUT` `/Topic/5a9adb572599ac1c04086386/topics/rel/5a9aee3b2599ac1c0408638d`
        Then calling the API returns 200 status 
          And the response body contains topicId=5a9adb572599ac1c04086386, newsId=5a9aee3b2599ac1c0408638d and id of NewsTopic record.

4. Get all `News` of a `Topic`

        Given is a `Topic` record with id='5a9adb572599ac1c04086386'
          and the `Topic` record is associated to `News` with ids: `5a9ae2632599ac1c04086388` and `5a9aee3b2599ac1c0408638d`
        When invoking `GET` `/Topics/5a9adb572599ac1c04086386` API endpoint
        Then calling the API returns 200 status 
          And the response body contains an array of these associated `News` by these ids: `5a9ae2632599ac1c04086388` and `5a9aee3b2599ac1c0408638d`