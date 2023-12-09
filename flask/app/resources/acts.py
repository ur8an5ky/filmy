from flask_restful import Resource, reqparse

class Acts(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('actor_id', required=True, help="Actor ID cannot be blank")
        parser.add_argument('movie_id', required=True, help="Movie ID cannot be blank")
        args = parser.parse_args()

        with self.driver.session() as session:
            session.run("MATCH (a:Actor {id: $actor_id}), (m:Movie {id: $movie_id}) "
                        "CREATE (a)-[:ACTS_IN]->(m)", 
                        actor_id=args['actor_id'], movie_id=args['movie_id'])
            return {"message": "Actor now acts in the movie"}, 201
