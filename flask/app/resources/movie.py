from flask_restful import Resource, reqparse
from neo4j import GraphDatabase, basic_auth
import uuid
from . import myUri, myPassword


class MovieResource(Resource):
    def __init__(self):
        self.driver = GraphDatabase.driver(myUri, auth=basic_auth("neo4j", myPassword))
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('title', required=True, help="Title cannot be blank")
        self.parser.add_argument('year', type=int, help="Year of the movie")

    def get(self):
        with self.driver.session() as session:
            result = session.run("MATCH (m:Movie) RETURN m.movie_id, m.title, m.year")
            movies = [{"movie_id": record["m.movie_id"], "title": record["m.title"], "year": record["m.year"]} for record in result]
            return {"movies": movies}, 200

    def post(self):
        args = self.parser.parse_args()
        movie_id = str(uuid.uuid4())
        title = args['title']
        year = args.get('year')

        with self.driver.session() as session:
            session.run("CREATE (m:Movie {movie_id: $id, title: $title, year: $year})", 
                        id=movie_id, title=title, year=year)
            return {"message": f"Movie '{title}' created successfully.", "movie_id": movie_id}, 201

    def __del__(self):
        self.driver.close()


class SingleMovieResource(Resource):
    def __init__(self):
        self.driver = GraphDatabase.driver(myUri, auth=basic_auth("neo4j", myPassword))
    def get(self, movie_id):
        with self.driver.session() as session:
            result = session.run("MATCH (m:Movie {movie_id: $movie_id}) "
                                 "RETURN m.title AS title, m.year AS year",
                                 movie_id=movie_id)
            movie_record = result.single()
            if movie_record:
                return {
                    "movie": {
                        "title": movie_record["title"],
                        "year": movie_record["year"]
                    }
                }, 200
            else:
                return {"message": "Movie not found"}, 404
    
    def delete(self, movie_id):
        with self.driver.session() as session:
            result = session.run("""
                MATCH (m:Movie {movie_id: $movie_id})
                DETACH DELETE m
                RETURN COUNT(m) AS deleted_count
            """, movie_id=movie_id)
            count = result.single()[0]
            if count == 0:
                return {"message": "Movie not found or already deleted."}, 404
            else:
                return {"message": "Movie deleted successfully."}, 200

    def __del__(self):
        self.driver.close()