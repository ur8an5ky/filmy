from flask_restful import Resource, reqparse
from neo4j import GraphDatabase, basic_auth
import uuid

class MovieResource(Resource):
    def __init__(self):
        self.driver = GraphDatabase.driver("neo4j+s://1c61e2d9.databases.neo4j.io", auth=basic_auth("neo4j", "LRcvS2deNTDBYl71nIJWLzzxQ069BefLKXlMx9hMjlc"))
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('title', required=True, help="Title cannot be blank")
        self.parser.add_argument('year', type=int, help="Year of the movie")

    def get(self):
        with self.driver.session() as session:
            result = session.run("MATCH (m:Movie) RETURN m.title, m.year")
            movies = [{"title": record["m.title"], "year": record["m.year"]} for record in result]
            return {"movies": movies}, 200

    def post(self):
        args = self.parser.parse_args()
        movie_id = str(uuid.uuid4())
        title = args['title']
        year = args.get('year')

        with self.driver.session() as session:
            session.run("CREATE (m:Movie {id: $id, title: $title, year: $year})", 
                        id=movie_id, title=title, year=year)
            return {"message": f"Movie '{title}' created successfully.", "id": movie_id}, 201

    def __del__(self):
        self.driver.close()
