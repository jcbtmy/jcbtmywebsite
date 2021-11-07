"""

Column Definition: 

stationName == name
station_id == station_id
lat = lat
lon = lon
"""

import json
import requests


stationsFile = open("Data/stationsJson.json", "r")
stationsRawData = stationsFile.read()
stations = json.loads(stationsRawData)

for station in stations:

    newStation = {"stationName" : station["name"], "station_id": station["station_id"], "lat" : station["lat"], "lon" : station["lon"]}
    headers = {'Content-type': 'application/json'}


    r = requests.post("https://jacob-toomey.com/api/Stations", data=json.dumps(newStation), headers=headers)

    print(r.status_code)