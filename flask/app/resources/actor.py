from flask_restful import Resource, reqparse
from neo4j import GraphDatabase, basic_auth
import uuid

class ActorResource(Resource):
    def __init__(self):
        self.driver = GraphDatabase.driver("neo4j+s://1c61e2d9.databases.neo4j.io", auth=basic_auth("neo4j", "LRcvS2deNTDBYl71nIJWLzzxQ069BefLKXlMx9hMjlc"))
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('first_name', required=True, help="First name cannot be blank")
        self.parser.add_argument('last_name', required=True, help="Last name cannot be blank")

    def get(self):
        with self.driver.session() as session:
            result = session.run("MATCH (a:Actor) RETURN a.first_name, a.last_name")
            actors = [{"first_name": record["a.first_name"], "last_name": record["a.last_name"]} for record in result]
            return {"actors": actors}, 200

    def post(self):
        args = self.parser.parse_args()
        first_name = args['first_name']
        last_name = args['last_name']
        actor_id = str(uuid.uuid4())

        with self.driver.session() as session:
            session.run("CREATE (a:Actor {id: $id, first_name: $first_name, last_name: $last_name})", 
                        id=actor_id, first_name=first_name, last_name=last_name)
            return {"message": f"Actor '{first_name} {last_name}' created successfully.", "id": actor_id}, 201

    def __del__(self):
        self.driver.close()
