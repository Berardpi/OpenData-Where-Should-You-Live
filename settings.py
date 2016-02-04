MONGO_HOST = 'localhost'
MONGO_PORT = 27017
MONGO_DBNAME = 'wsil'

X_DOMAINS = "*"
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
  },
  "citelib": {
    "schema": {
      "type": {"type": "string"},
      "features": {"type": "geometrycollection"},
      "properties": {"type": "list"},
      "geometry": {"type": "polygon"},
    }
  },
  "stop": {
    "schema": {
      "type": {"type": "string"},
      "features": {"type": "geometrycollection"},
      "properties": {"type": "list"},
      "geometry": {"type": "polygon"},
    }
  },
  "gsm": {
    "schema": {
      "type": {"type": "string"},
      "properties": {"type": "list"},
      "geometry": {"type": "polygon"},
    }
  },
  "restaurant": {
    "schema": {
      "type": {"type": "string"},
      "features": {"type": "geometrycollection"},
      "properties": {"type": "list"},
      "geometry": {"type": "polygon"}
    }
  },
  "supermarket": {
    "schema": {
      "type": {"type": "string"},
      "features": {"type": "geometrycollection"},
      "properties": {"type": "list"},
      "geometry": {"type": "polygon"}
    }
  },
  "grenoble": {
    "schema": {
      "id": {"type": "string"},
      "type": {"type": "string"},
      "properties": {"type": "list"},
      "geometry": {"type": "polygon"}
    }
  },
}