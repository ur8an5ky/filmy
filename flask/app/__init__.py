from flask import Flask
from flask_restful import Api
from .resources.movie import MovieResource, SingleMovieResource
from .resources.director import DirectorResource
from .resources.directs import Directs, MovieDirectorResource, DirectorMoviesResource
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    api = Api(app)
    CORS(app)

    api.add_resource(MovieResource, '/movie')
    api.add_resource(SingleMovieResource, '/movie/<string:movie_id>')
    
    api.add_resource(DirectorResource, '/director')
    
    api.add_resource(Directs, '/directs')
    
    api.add_resource(MovieDirectorResource, '/movie/<string:movie_id>/director')
    api.add_resource(DirectorMoviesResource, '/director/<string:director_id>/movies')

    return app
