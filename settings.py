MONGO_HOST = 'localhost'
MONGO_PORT = 27017
MONGO_DBNAME = 'wsil'

PAGINATION = False
TRANSPARENT_SCHEMA_RULES = True
DOMAIN = {
  'cyclelane': {
    "schema": {
      "type": {"type": "string"},
      "features": {"type": "geometrycollection"},
    }
  },
}