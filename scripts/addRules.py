import json 
import requests




ruleFile = open("Data/ruleSet.json", "r")
ruleRawData = ruleFile.read()
rules = json.loads(ruleRawData)

for rule in rules:
    headers = {'Content-type': 'application/json'}
    r = requests.post("https://jacob-toomey.com/api/CAHashing/CreateRule", data=json.dumps(rule), headers=headers)
    print(r.status_code)