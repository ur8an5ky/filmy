from flask_restful import Resource, reqparse
from neo4j import GraphDatabase, basic_auth

class Directs(Resource):
    def __init__(self):
        self.driver = GraphDatabase.driver("neo4j+s://1c61e2d9.databases.neo4j.io", 
                                           auth=basic_auth("neo4j", "LRcvS2deNTDBYl71nIJWLzzxQ069BefLKXlMx9hMjlc"))
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('director_id', required=True, help="Director ID cannot be blank")
        self.parser.add_argument('movie_id', required=True, help="Movie ID cannot be blank")

    def post(self):
        args = self.parser.parse_args()
        director_id = args['director_id']
        movie_id = args['movie_id']

        with self.driver.session() as session:
            result = session.run("MATCH (d:Director)-[:DIRECTS]->(m:Movie {movie_id: $movie_id}) RETURN d",
                                 movie_id=movie_id)
            current_director = result.single()
            if current_director:
                return {"message": "This movie already has a director.", "director": current_director["d"].get("id")}, 400
            else:
                session.run("MATCH (d:Director {director_id: $director_id}), (m:Movie {movie_id: $movie_id}) "
                            "CREATE (d)-[:DIRECTS]->(m)",
                            director_id=director_id, movie_id=movie_id)
                return {"message": "Director now directs the movie"}, 201

    def __del__(self):
        self.driver.close()


class MovieDirectorResource(Resource):
    def __init__(self):
        self.driver = GraphDatabase.driver("neo4j+s://1c61e2d9.databases.neo4j.io", 
                                           auth=basic_auth("neo4j", "LRcvS2deNTDBYl71nIJWLzzxQ069BefLKXlMx9hMjlc"))

    def get(self, movie_id):
        with self.driver.session() as session:
            result = session.run("MATCH (d:Director)-[:DIRECTS]->(m:Movie {movie_id: $movie_id}) "
                                 "RETURN d.first_name AS first_name, d.last_name AS last_name",
                                 movie_id=movie_id)
            director_record = result.single()
            if director_record:
                return {
                    "director": {
                        "first_name": director_record["first_name"],
                        "last_name": director_record["last_name"]
                    }
                }, 200
            else:
                return {"message": "No director found for this movie"}, 404

    def __del__(self):
        self.driver.close()