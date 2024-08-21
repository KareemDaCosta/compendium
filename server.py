from flask import Flask
from flask import render_template
from flask import Response, request, jsonify, redirect
import json
import base_data
app = Flask(__name__)

#data
data = base_data.data

current_id = 12

@app.route('/', methods=['GET'])
def home():
    return render_template("home.html", data=data)

@app.route('/search/<search_term>', methods=['GET'])
def search(search_term):
    search_results = []
    for entry in data:
        if search_term.lower() in data[entry]['name'].lower():
            search_results.append({"match": "name", "data": data[entry], "index": data[entry]['name'].lower().index(search_term.lower()), "length": len(search_term)})
        elif search_term.lower() in data[entry]['type'].lower():
            search_results.append({"match": "type", "data": data[entry], "index": data[entry]['type'].lower().index(search_term.lower()), "length": len(search_term)})
        elif search_term.lower() in data[entry]['alignment'].lower():
            search_results.append({"match": "alignment", "data": data[entry], "index": data[entry]['alignment'].lower().index(search_term.lower()), "length": len(search_term)})
        else:
            try:
                if float(search_term) == data[entry]['cr']:
                    search_results.append({"match": "cr", "data": data[entry]})
            except:
                pass
            
    return render_template("search.html", data=search_results, search_term=search_term)

@app.route('/view/<id>', methods=['GET'])
def view(id):
    if str(id) in data:
            return render_template("view.html", data=data[id])
    return render_template("404.html")

@app.route('/add', methods=['GET'])
def add():
    return render_template("add.html")

@app.route('/add_creature', methods=['POST'])
def add_creature():
    global current_id
    current_id += 1
    json_data = request.get_json()
    speeds = []
    for speed in json_data['speeds']:
        speeds.append({"type": speed['type'].lower(), "distance": int(speed['distance'])})
    data[str(current_id)] = {
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
    return json.dumps({'success':True, "id": current_id}), 200, {'ContentType':'application/json'} 
    
@app.route('/edit/<id>', methods=['GET'])
def edit(id):
    if str(id) in data:
        return render_template("edit.html", data=data[id])
    return render_template("404.html")

@app.route('/edit_creature', methods=['POST'])
def edit_creature():
    json_data = request.get_json()
    speeds = []
    for speed in json_data['speeds']:
        speeds.append({"type": speed['type'].lower(), "distance": int(speed['distance'])})
    data[str(json_data['id'])] = {
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
    return json.dumps({'success':True, "id": json_data['id']}), 200, {'ContentType':'application/json'}

if __name__ == '__main__':
    app.run()