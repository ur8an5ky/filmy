from flask_restful import Resource, reqparse
from neo4j import GraphDatabase, basic_auth
import uuid
from . import myUri, myPassword


class DirectorResource(Resource):
    def __init__(self):
        self.driver = GraphDatabase.driver(myUri, auth=basic_auth("neo4j", myPassword))
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('first_name', required=True, help="First name cannot be blank")
        self.parser.add_argument('last_name', required=True, help="Last name cannot be blank")

    def get(self):
        with self.driver.session() as session:
            result = session.run("MATCH (d:Director) RETURN d.director_id, d.first_name, d.last_name")
            directors = [{"director_id": record["d.director_id"], "first_name": record["d.first_name"], "last_name": record["d.last_name"]} for record in result]
            return {"directors": directors}, 200

    def post(self):
        args = self.parser.parse_args()
        director_id = str(uuid.uuid4())
        first_name = args['first_name']
        last_name = args['last_name']

        with self.driver.session() as session:
            session.run("CREATE (d:Director {director_id: $id, first_name: $first_name, last_name: $last_name})", 
                        id=director_id, first_name=first_name, last_name=last_name)
            return {"message": f"Director '{first_name} {last_name}' created successfully.", "director_id": director_id}, 201

    def __del__(self):
        self.driver.close()
