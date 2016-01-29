#!/bin/sh

# Cycle lane
curl http://metromobilite.fr/data/Carto/Statique/velo.geojson > cycle_lane.geojson
mongoimport --jsonArray --host localhost:27017 --db wsil --collection cyclelane --drop --file cycle_lane.geojson
rm cycle_lane.geojson