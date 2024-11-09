import pymongo
import random
from flask import Flask
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["Wastend"]
mycol = mydb["findings"]
events = mydb["events"]

app = Flask(__name__)

@app.route('/')
def hello_world():
    return '/evnets'



def generateIntForCoordinates(lower_bound, upper_bound):
    return random.randint(lower_bound, upper_bound)

def generteData():
    user_id = "y90v5d9rq5y4wsq7ck7x"
    image = "b870618f-ede9-47a1-8aa8-92cf92c3bdd6"
    resolved = False
    created_at = "2021-09-01T00:00:00.000Z" #TODO validate
    updated_at = "2021-09-01T00:00:00.000Z" #TODO validate
    longitude = generateIntForCoordinates(-180, 180)
    latitude = generateIntForCoordinates(-90, 90)
    return {"user_id": user_id, "image": image, "resolved": resolved, "created_at": created_at, "updated_at": updated_at, "longitude": longitude, "latitude": latitude}

def pushData(dict):
    x = mycol.insert_one(dict)

#declare a map
discover_map = {}

#function to look for close points based on coordinates
def findClosePoints(longitude, latitude, treshold, radius=5):
    myquery = {"longitude": {"$gt": longitude - radius, "$lt": longitude + radius}, "latitude": {"$gt": latitude - radius, "$lt": latitude + radius}}
    count = mycol.count_documents(myquery)

    mydoc = mycol.find(myquery)
    cord_list = []
    for x in mydoc:
        cord_list.append((x["longitude"], x["latitude"]))

    cord_list = str(cord_list)


    if count >= treshold:
        if cord_list in discover_map:
            s = discover_map[cord_list]
            #turn s into tuple and get third element for comparison
            c = tuple(s)[2]
            count = max(count, c)
        #create tuple with longitude and latitude and count
        t = (longitude, latitude, count)
        discover_map[cord_list] = t


def generateEvent():
    for key, value in discover_map.items():
        longitude = value[0]
        latitude = value[1]
        # Push to database collection events
        events.insert_one({"longitude": longitude, "latitude": latitude, "date": "2021-09-01T00:00:00.000Z" })


#function to iterate over the coordinates and find the one with the most close points
def iterateOverCoordinates(treshold, radius=5):
    for i in range(-180, 180):
        for j in range(-90, 90):
            findClosePoints(i, j, treshold)
    generateEvent()

@app.route('/events')
def getEvents():
    iterateOverCoordinates(3)

if __name__ == '__main__':
    # for i in range(30):
        # pushData(generteData())
    iterateOverCoordinates(3)
