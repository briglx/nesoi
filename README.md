# nesoi

This project started as an example on game design. There is a world made up of several pages and each page has tiles. The player can move from tile to tile.

## Prerequisites
* Apache is installed and configured 


## Installing

* Clone and navigate to the project 
```bash
$ git clone path/to/nesoi
$ cd nesoi
```
* Install nodejs
```bash
$ apt-get install nodejs
$ apt-get install build-essential
```
* Install Mongodb See [Installng Mongo on Ubuntu | https://docs.mongodb.org/v3.0/tutorial/install-mongodb-on-ubuntu/]
* Start Mongo service
* Execute DB script to load data
```bash
$ cd /path/to/nesoi/db
$ mongo db.sj
```
* Start back-end service
```bash
$ cd /path/to/nesoi/src
$ npm install
$ node index.js
```
* Install gulp globally
```bash
$ sudo npm install gulp -g
```
* Start front-end
```bash
$ cd /path/to/nesoi
$ gulp
```
