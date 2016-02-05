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