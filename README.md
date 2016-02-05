# Challenge Open Data : Where should I live

This is a small application using a mongodb database, sets of open data and 3D.js to help the user find the Grenoble neighborhood in which he'd like to live.

/!\ To run the application, you need to run BOTH the client and the server (run.py + mongo).

## Dependencies
To install the project, you need to have bower, node, npm, mongoDB, ruby (for compass), python, pip installed on your machine.

## Client 

### Set up of the application
Run `bower install` and `npm install` to install the dependencies.

### Build & development

Run `grunt serve` to launch the front-end of the application.

## Server

### Setup
You'll need mongo to be able to run the application. We use python-eve to provide a REST API on top of the database.
To install eve run:
```shell
pip install eve
```

### Testing mongo and eve
First of all launch a mongo instance:
```shell
mongod --shardsvr --dbpath mongo --port 27017
```

Then run the get_data script to populate the db. Data are fetch from the internet:
```shell
./get_data.sh
```

You can now lauch an eve instance:
```shell
python run.py
```

You can now test a REST call on your eve serveur:
```shell
curl http://127.0.0.1:5000/cyclelane
```
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

