from flask import Flask, send_from_directory
from flask_restful import Api
from .resources.movie import MovieResource, SingleMovieResource
from .resources.director import DirectorResource
from .resources.directs import Directs, MovieDirectorResource, DirectorMoviesResource
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__, static_folder='../../react/movies_with_neo4j/dist')
    api = Api(app)
    CORS(app)

    api.add_resource(MovieResource, '/movie')
    api.add_resource(SingleMovieResource, '/movie/<string:movie_id>')
    
    api.add_resource(DirectorResource, '/director')
    
    api.add_resource(Directs, '/directs')
    
    api.add_resource(MovieDirectorResource, '/movie/<string:movie_id>/director')
    api.add_resource(DirectorMoviesResource, '/director/<string:director_id>/movies')

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app

    return app
