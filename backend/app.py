from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from datetime import datetime
import json

import pw

app = Flask(__name__)
CORS(app)
# CORS(app, origins=["http://localhost:5000/", "http://localhost:5173/"])


if __name__ == "__main__":
    app.run(debug=True)

# Configurazione del database
app.config[
    "SQLALCHEMY_DATABASE_URI"
] = f"mysql://{pw.DBUSER}:{pw.DBPW}@{pw.DBHOST}:{pw.DBPORT}/{pw.DB}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Inizializzazione dell'estensione SQLAlchemy
db = SQLAlchemy(app)


class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(30))
    cognome = db.Column(db.String(30))
    ruolo = db.Column(db.String(30), default=None)


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    titolo = db.Column(db.String(30))
    assegnazione = db.Column(db.DateTime)
    scadenza = db.Column(db.DateTime)
    stato = db.Column(db.String(10), default="ToDo")
    flag = db.Column(db.Boolean, default=True)

    teamid = db.Column(db.Integer, db.ForeignKey("team.id"))
    team = db.relationship("Team", backref="tasks")


@app.route("/teamMember", methods=["GET", "POST"])
def team():
    fetch = Team.query.all()
    # print(Team.query.all())
    if fetch:
        data = [
            {
                "id": member.id,
                "nome": member.nome,
                "cognome": member.cognome,
            }
            for member in fetch
        ]
        response = app.response_class(
            response=json.dumps(data), status=200, mimetype="application/json"
        )
    else:
        response = jsonify({"msg": "No data", "code": 404})
    return response

    # rispondere con il fetch


@app.route("/setTask", methods=["POST"])  # C
def assegnazioneTask():
    titolo = request.json["titolo"]
    time = datetime.now()
    assegnazione = time.date()
    scadenza = request.json["scadenza"]
    teamid = int(request.json["teamid"])

    insert = Task(
        titolo=titolo, assegnazione=assegnazione, scadenza=scadenza, teamid=teamid
    )

    db.session.add(insert)
    db.session.commit()

    response = jsonify(
        {
            "msg": "Task registrata",
            "code": 201,
            "titolo": titolo,
            "time": time,
            "assegnazione": insert.assegnazione,
            "scadenza": scadenza,
            "teamid": teamid,
            "id": insert.id,
        }
    )
    return response


# R
@app.route("/getTask", methods=["GET"])
def getTask():
    fetch = (
        Task.query.filter_by(flag=True)
        .join(Team)
        .add_columns(Team.nome, Team.cognome)
        .filter(Task.teamid == Team.id)
        .all()
    )
    if fetch:
        # print(repr(fetch))
        data = [
            {
                "id": task.Task.id,
                "titolo": task.Task.titolo,
                "assegnazione": task.Task.assegnazione.strftime("%Y-%m-%d"),
                "scadenza": task.Task.scadenza.strftime("%Y-%m-%d"),
                "stato": task.Task.stato,
                "nome": task.nome,
                "cognome": task.cognome,
            }
            for task in fetch
        ]
        response = app.response_class(
            response=json.dumps(data), status=200, mimetype="application/json"
        )
    else:
        response = jsonify({"msg": "No data", "code": 404})
    return response


# U
@app.route("/updateTask", methods=["POST"])
def updateTask():
    id = request.json["id"]
    stato = request.json["stato"]
    titolo = request.json["titolo"]
    scadenza = request.json["scadenza"]
    teamid = request.json["teamid"]

    update = Task.query.filter_by(id=id).update(
        dict(stato=stato, titolo=titolo, scadenza=scadenza, teamid=teamid)
    )
    db.session.commit()
    response = jsonify({"msg": "Task aggiornata", "code": 203})
    return response


# D
@app.route("/deleteTask", methods=["POST"])
def deleteTask():
    id = request.json["id"]
    # fare un update cambiando lo stato di flag a false
    update = Task.query.filter_by(id=id).update(dict(flag=False))
    db.session.commit()
    response = jsonify({"msg": "Task cancellata", "code": 201})
    return response
