from eve import Eve
from flask import redirect, send_from_directory, render_template
from eve import Eve
import os

app = Eve()

PWD = os.environ.get('PWD')
dist = os.path.join(PWD, 'dist')
scripts = os.path.join(dist, 'scripts')
styles = os.path.join(dist, 'styles')
images = os.path.join(dist, 'images')
bower_comp = os.path.join(dist, 'bower_components')
views = os.path.join(dist, 'views')

app = Eve(static_folder=dist)

# serve index.html
@app.route('/index.html')
def index():
    return send_from_directory(dist, 'index.html')

@app.route('/scripts/<path:filename>')
def getScripts(filename):
    return send_from_directory(scripts,
                               filename, as_attachment=True)

@app.route('/styles/<path:filename>')
def getStyles(filename):
    return send_from_directory(styles,
                               filename, as_attachment=True)


@app.route('/images/<path:filename>')
def getImages(filename):
    return send_from_directory(images,
                               filename, as_attachment=True)

@app.route('/bower_components/<path:filename>')
def getBowerComp(filename):
    return send_from_directory(bower_comp,
                               filename, as_attachment=True)

@app.route('/views/<path:filename>')
def getViews(filename):
    return send_from_directory(views,
                               filename, as_attachment=True)

app.run(host="0.0.0.0", debug=True)

if __name__ == '__main__':
  app.run(debug=True)