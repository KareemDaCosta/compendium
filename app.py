import random
import secrets
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify, redirect
from flask import session
import json
import base_data
app = Flask(__name__)
app.secret_key = secrets.token_urlsafe(16)

user_data = {}

@app.route('/', methods=['GET'])
def home():
    return render_template("home.html", data=get_data())

@app.route('/session', methods=['POST'])
def set_session():
    json_data = request.get_json()
    if hasattr(json_data, 'session_id') and json_data["session_id"] in base_data.user_data:
        session['session_id'] = json_data["session_id"]
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

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
    if('session_id' in json_data):
        session['session_id'] = json_data['session_id']
    else:
        session['session_id'] = createSessionId()
    get_data()[str(current_id)] = {
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
    return json.dumps({'success':True, "id": current_id, "session_id": session.get("session_id")}), 200, {'ContentType':'application/json'} 
    
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
    if('session_id' in json_data):
        session['session_id'] = json_data['session_id']
    else:
        session['session_id'] = createSessionId()
    get_data()[str(json_data['id'])] = {
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
    return json.dumps({'success':True, "id": json_data['id'], "session_id": session.get("session_id")}), 200, {'ContentType':'application/json'}

def get_data():
    if(session.get('session_id') == None):
        return base_data.data
    elif session.get('session_id') not in user_data:
        user_data[session.get('session_id')] = base_data.data.copy()
        return user_data[session.get('session_id')]
    return user_data[session.get('session_id')]

def createSessionId():
    session_id = random.randint(100000000, 999999999)
    if(session_id in user_data):
        createSessionId()
    return session_id
    

if __name__ == '__main__':
    app.run()