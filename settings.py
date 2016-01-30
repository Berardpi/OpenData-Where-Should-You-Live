MONGO_HOST = 'localhost'
MONGO_PORT = 27017
MONGO_DBNAME = 'wsil'

PAGINATION = False
TRANSPARENT_SCHEMA_RULES = True
DOMAIN = {
  "cyclelane": {
    "schema": {
      "type": {"type": "string"},
      "id": {"type": "integer"},
      "properties": {"type": "list"},
      "geometry": {"type": "linestring"},
    }
  },
  "neighborhood": {
    "schema": {
      "type": {"type": "string"},
      "properties": {"type": "list"},
      "geometry": {"type": "polygon"},
    }
  }
}