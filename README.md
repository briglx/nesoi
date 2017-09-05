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
* Test Backend
   * Open Advance Rest Client
   * Navigate to http://127.0.0.1:8080/api/terrain?p=0,0
   ```json
   {"terrain":      
       [{"_id":"59aeba34ac63c0a528baac6c","x":0,"y":0,"terrain":"mountainGreen","traversable":false,"mY":0,"mX":0,"idx":0}, 
       {"_id":"59aeba34ac63c0a528baac6d","x":1,"y":0,"terrain":"mountainGreen","traversable":false,"mY":0,"mX":1,"idx":1},
       {"_id":"59aeba34ac63c0a528baac6e","x":2,"y":0,"terrain":"mountainGreen","traversable":false,"mY":0,"mX":2,"idx":2},
       {"_id":"59aeba34ac63c0a528baac6f","x":3,"y":0,"terrain":"mountainGreen","traversable":false,"mY":0,"mX":3,"idx":3},
       {"_id":"59aeba34ac63c0a528baac70","x":4,"y":0,"terrain":"mountainGreen","traversable":false,"mY":0,"mX":4,"idx":4},
       {"_id":"59aeba34ac63c0a528baac71","x":5,"y":0,"terrain":"mountainGreen","traversable":false,"mY":0,"mX":5,"idx":5},
       {"..."}
       ]
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
* Configure Analtyics
    * Install anaconda
    * Install pymongo
    ```bash
    $ pip install -upgrade pip
    $ python -m pip install pymongo
    ````
