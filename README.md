# AdvancedNodeStarter

<img src="https://travis-ci.org/perenciolo/advancednodeblogger.svg?branch=master" alt="build:passed"/>

Starting project for a blogging in nodejs

## Docker building commands

- MongoDB

  ```
  docker run -d -p 27017:27017 --name advnc-mongo \
    -e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
    -e MONGO_INITDB_ROOT_PASSWORD=secret \
    mongo
  ```

- Redis
  ```
  docker run -d -p 6379:6379 --name advnc-redis redis
  ```

## CI

this project has configured Travis CI continuous integration.
