#!/bin/bash

function process_file {
  sed -i '$ d' $1
  sed -i '1d' $1
  sed -i '1d' $1
}

function process_file_bis {
  sed -i '$ d' $1
  sed -i '1d' $1
  sed -i '1d' $1
}

# neighborhood
curl http://sig.grenoble.fr/opendata/Decoupage/json/UNIONS_DE_QUARTIER_EPSG4326.json > neighborhood.geojson
process_file "neighborhood.geojson"
mongoimport --jsonArray --host localhost:27017 --db wsil --collection neighborhood --drop --file neighborhood.geojson
rm neighborhood.geojson



# Cycle lane
curl http://metromobilite.fr/data/Carto/Statique/velo.geojson > cycle_lane.geojson
process_file "cycle_lane.geojson"
mongoimport --jsonArray --host localhost:27017 --db wsil --collection cyclelane --drop --file cycle_lane.geojson
rm cycle_lane.geojson


# Citelib
curl http://data.metromobilite.fr/api/bbox/json?types=citelib > citelib.geojson
sed -i 's/^.\{40\}//' citelib.geojson
sed -i '$s/..$//' citelib.geojson
mongoimport --jsonArray --host localhost:27017 --db wsil --collection citelib --drop --file citelib.geojson
rm citelib.geojson

# Stop
curl http://www.metromobilite.fr/data/Carto/Statique/ArretsLight.geojson > stop.geojson
process_file_bis "stop.geojson"
mongoimport --jsonArray --host localhost:27017 --db wsil --collection stop --drop --file stop.geojson
rm stop.geojson

# GSM
curl http://sig.grenoble.fr/opendata/Antenne_GSM/json/DSPE_ANT_GSM_EPSG4326.json > gsm.geojson
process_file "gsm.geojson"
mongoimport --jsonArray --host localhost:27017 --db wsil --collection gsm --drop --file gsm.geojson
rm gsm.geojson

# Restaurant: 
 curl --globoff "http://overpass-api.de/api/interpreter?data=[out:json];area[name=%22Grenoble%22]-%3E.a;(node(area.a)[amenity=restaurant];);out;" > restaurant.osm
 node_modules/.bin/osmtogeojson -f json restaurant.osm > restaurant.geojson
 process_file "restaurant.geojson"
 mongoimport --jsonArray --host localhost:27017 --db wsil --collection restaurant --drop --file restaurant.geojson
 rm restaurant.{osm,geojson}

# Supermarket :
 curl --globoff "http://overpass-api.de/api/interpreter?data=[out:json];area[name=%22Grenoble%22]-%3E.a;(node(area.a)[shop=supermarket];);out;" > supermarket.osm
 node_modules/osmtogeojson/osmtogeojson -f json supermarket.osm > supermarket.geojson
 process_file "supermarket.geojson"
 mongoimport --jsonArray --host localhost:27017 --db wsil --collection supermarket --drop --file supermarket.geojson
 rm supermarket.{osm,geojson}

# Grenoble Boundary :
 curl --globoff "http://overpass-api.de/api/interpreter?data=[out:json];(rel[name=Grenoble];%3E;);out;" > grenoble.osm 
 node_modules/osmtogeojson/osmtogeojson -f json grenoble.osm > grenoble.geojson
 process_file "grenoble.geojson"
 mongoimport --jsonArray --host localhost:27017 --db wsil --collection grenoble_all --drop --file grenoble.geojson
 rm grenoble.{osm,geojson}

# Process data in node to accelerate all futur requests
timeout 10s node process_data.js


