from flask_restful import Resource, reqparse
from neo4j import GraphDatabase, basic_auth
from . import myUri, myPassword


class Directs(Resource):
    def __init__(self):
        self.driver = GraphDatabase.driver(myUri, auth=basic_auth("neo4j", myPassword))
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
        self.driver = GraphDatabase.driver(myUri, auth=basic_auth("neo4j", myPassword))

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
                return {"message": "No director found for this movie", "director": None}, 200

    def __del__(self):
        self.driver.close()


class DirectorMoviesResource(Resource):
    def __init__(self):
        self.driver = GraphDatabase.driver(myUri, auth=basic_auth("neo4j", myPassword))

    def get(self, director_id):
        with self.driver.session() as session:
            director_result = session.run("""
                MATCH (d:Director {director_id: $director_id})
                RETURN d.director_id AS director_id, d.first_name AS first_name, d.last_name AS last_name
            """, director_id=director_id)
            director_record = director_result.single()

            movies_result = session.run("""
                MATCH (d:Director {director_id: $director_id})-[:DIRECTS]->(m:Movie)
                RETURN m.movie_id AS movie_id, m.title AS title, m.year AS year
            """, director_id=director_id)
            movies = [{"movie_id": record["movie_id"], "title": record["title"], "year": record["year"]} 
                      for record in movies_result]

            if director_record:
                return {
                    "director": {
                        "director_id": director_record["director_id"],
                        "first_name": director_record["first_name"],
                        "last_name": director_record["last_name"]
                    },
                    "movies": movies
                }, 200
            else:
                return {"message": "Director not found"}, 404

    def __del__(self):
        self.driver.close()