from flask_restful import Resource, reqparse

class Directs(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('director_id', required=True, help="Director ID cannot be blank")
        parser.add_argument('movie_id', required=True, help="Movie ID cannot be blank")
        args = parser.parse_args()

        with self.driver.session() as session:
            session.run("MATCH (d:Director {id: $director_id}), (m:Movie {id: $movie_id}) "
                        "CREATE (d)-[:DIRECTS]->(m)", 
                        director_id=args['director_id'], movie_id=args['movie_id'])
            return {"message": "Director now directs the movie"}, 201
