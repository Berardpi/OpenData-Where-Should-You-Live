# Challenge Open Data : Where should I live

This is a small application using a mongodb database, sets of open data and 3D.js to help the user find the Grenoble neighborhood in which he'd like to live.

## Dependencies
To install the project, you need to have bower, node, npm, mongoDB, ruby (for compass), python, pip installed on your machine.

## Deployment

### Installing everything 

#### Building the angular client
Run `bower install` and `npm install` to install the dependencies.

Build the app to create a dist folder containing everything.
```shell
grunt build
```

#### Installing & populating the database 

First of all launch a mongo instance:
```shell
mongod --shardsvr --dbpath mongo --port 27017
```

Then run the get_local_data script to populate the db. Data are fetched from the local data directory:
```shell
./get_local_data.sh
```

#### Installing python server

The server will serve the html AND will be used as a REST API.

To install Eve (python server) run:
```shell
pip install eve
```

### Launching the app

Once everything is installed, you just have to launch the DB and the python server.

To launch a mongo instance : 
launch a mongo instance:
```shell
mongod --shardsvr --dbpath mongo --port 27017
```

To launch an eve server instance:
```shell
python run.py
```

## Using the app
The web app will be deployed at the address http://localhost:5000/index.html#/


## Video 
[![Alt text for your video](http://img.youtube.com/vi/rY4qqBBxDiI/0.jpg)](https://www.youtube.com/embed/rY4qqBBxDiI)

## Screenshots
#### Contextualized map
![alt tag](https://cloud.githubusercontent.com/assets/631898/12843549/703395f0-cbfa-11e5-9518-c4b90c673471.png)
![alt tag](https://cloud.githubusercontent.com/assets/631898/12843548/7031acc2-cbfa-11e5-91c6-b5279ec9f227.png)

#### Single-criterion comparison (1 criterion : n neighborhoods)
![alt tag](https://cloud.githubusercontent.com/assets/631898/12843550/70342fc4-cbfa-11e5-92ef-b236be4dcef4.png)

#### Multi-criteria comparison (n criteria : n neighborhoods)
![alt tag](https://cloud.githubusercontent.com/assets/631898/12843547/7031399a-cbfa-11e5-975a-16e286ccf31a.png)

#### Neighborhood details (n criteria : 1 neighborhood)
![alt tag](https://cloud.githubusercontent.com/assets/631898/12843546/702f8fc8-cbfa-11e5-9234-42f793d53a13.png)

