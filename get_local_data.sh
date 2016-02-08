!#/bin/bash

# neighborhood
mongoimport --jsonArray --host localhost:27017 --db wsil --collection neighborhood --drop --file ./data/neighborhood.geojson

# Cycle lane
mongoimport --jsonArray --host localhost:27017 --db wsil --collection cyclelane --drop --file ./data/cycle_lane.geojson

# Citelib
mongoimport --jsonArray --host localhost:27017 --db wsil --collection citelib --drop --file ./data/citelib.geojson

# Stop
mongoimport --jsonArray --host localhost:27017 --db wsil --collection stop --drop --file ./data/stop.geojson

# GSM
mongoimport --jsonArray --host localhost:27017 --db wsil --collection gsm --drop --file ./data/gsm.geojson

# Restaurant: 
mongoimport --jsonArray --host localhost:27017 --db wsil --collection restaurant --drop --file ./data/restaurant.geojson

# Supermarket :
mongoimport --jsonArray --host localhost:27017 --db wsil --collection supermarket --drop --file ./data/supermarket.geojson

# Grenoble Boundary :
mongoimport --jsonArray --host localhost:27017 --db wsil --collection grenoble_all --drop --file ./data/grenoble.geojson

# Process data in node to accelerate all futur requests
echo "processing data (~10 secs) ..."
timeout 10s node process_data.js