#!/bin/bash

function process_file {
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