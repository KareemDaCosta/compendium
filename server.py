import random
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify, redirect
import json
import base_data
app = Flask(__name__)

user_data = {}

@app.route('/', methods=['GET'])
def home():
    return render_template("home.html", data=get_data())

@app.route('/search/<search_term>', methods=['GET'])
def search(search_term):
    search_results = []
    for entry in get_data():
        if search_term.lower() in get_data()[entry]['name'].lower():
            search_results.append({"match": "name", "data": get_data()[entry], "index": get_data()[entry]['name'].lower().index(search_term.lower()), "length": len(search_term)})
        elif search_term.lower() in get_data()[entry]['type'].lower():
            search_results.append({"match": "type", "data": get_data()[entry], "index": get_data()[entry]['type'].lower().index(search_term.lower()), "length": len(search_term)})
        elif search_term.lower() in get_data()[entry]['alignment'].lower():
            search_results.append({"match": "alignment", "data": get_data()[entry], "index": get_data()[entry]['alignment'].lower().index(search_term.lower()), "length": len(search_term)})
        else:
            try:
                if float(search_term) == get_data()[entry]['cr']:
                    search_results.append({"match": "cr", "data": get_data()[entry]})
            except:
                pass
            
    return render_template("search.html", data=search_results, search_term=search_term)

@app.route('/view/<id>/<session_id>', methods=['GET'])
def view_with_id(id, session_id):
    if str(id) in get_data(session_id):
        print(get_data(session_id)[id])
        return render_template("view.html", data=get_data(session_id)[id])
    return render_template("404.html")

@app.route('/view/<id>', methods=['GET'])
def view(id):
    if str(id) in get_data():
            return render_template("view.html", data=get_data()[id])
    return render_template("404.html")

@app.route('/add', methods=['GET'])
def add():
    return render_template("add.html")

@app.route('/add_creature', methods=['POST'])
def add_creature():
    current_id = len(get_data())
    current_id += 1
    json_data = request.get_json()
    speeds = []
    for speed in json_data['speeds']:
        speeds.append({"type": speed['type'].lower(), "distance": int(speed['distance'])})
    session_id = json_data['session_id'] if 'session_id' in json_data and json_data["session_id"] in user_data else createSessionId()
    get_data(session_id)[str(current_id)] = {
        "id": current_id,
        "name": json_data['name'],
        "url": json_data['url'],
        "image": json_data['image'],
        "cr": float(json_data['cr']),
        "size": json_data['size'],
        "type": json_data['type'],
        "alignment": json_data['alignment'],
        "hp": int(json_data['hp']),
        "ac": int(json_data['ac']),
        "movement": speeds,
        "description": json_data['description']
    }
    return json.dumps({'success':True, "id": current_id, "session_id": session_id}), 200, {'ContentType':'application/json'} 
    
@app.route('/edit/<id>', methods=['GET'])
def edit(id):
    if str(id) in get_data():
        return render_template("edit.html", data=get_data()[id])
    return render_template("404.html")

@app.route('/edit_creature', methods=['POST'])
def edit_creature():
    json_data = request.get_json()
    speeds = []
    for speed in json_data['speeds']:
        speeds.append({"type": speed['type'].lower(), "distance": int(speed['distance'])})
    session_id = json_data['session_id'] if 'session_id' in json_data and json_data["session_id"] in user_data else createSessionId()
    get_data(session_id)[str(json_data['id'])] = {
        "id": int(json_data['id']),
        "name": json_data['name'],
        "url": json_data['url'],
        "image": json_data['image'],
        "cr": float(json_data['cr']),
        "size": json_data['size'],
        "type": json_data['type'],
        "alignment": json_data['alignment'],
        "hp": int(json_data['hp']),
        "ac": int(json_data['ac']),
        "movement": speeds,
        "description": json_data['description']
    }
    return json.dumps({'success':True, "id": json_data['id'], "session_id": session_id}), 200, {'ContentType':'application/json'}

def get_data(session_id = None):
    if(session_id == None):
        return base_data.data
    elif session_id not in user_data:
        user_data[session_id] = base_data.data.copy()
        return user_data[session_id]
    return user_data[session_id]

def createSessionId():
    session_id = random.randint(100000000, 999999999)
    if(session_id in user_data):
        createSessionId()
    return session_id
    

if __name__ == '__main__':
    app.run()