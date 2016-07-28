import urllib

import web
import requests
import json
import cStringIO

from web.wsgiserver import CherryPyWSGIServer 

CherryPyWSGIServer.ssl_certificate = "C:\Users\Administrator\Documents\RESTful\server.crt" 
CherryPyWSGIServer.ssl_private_key = "C:\Users\Administrator\Documents\RESTful\server.key"

paths = (
  '/api/(.+)/(.+)/(.+)', 'GithubData'
)

app = web.application(paths, globals())


class GithubData:
	def GET(self, first, second, thrid):
		web.header('Access-Control-Allow-Origin', '*')
		web.header('Access-Control-Allow-Credentials', 'true')
		web.header('Content-Type', 'application/json')
		full_name =  first + '/' + second
		dataType = thrid.replace('-', '/')
		headers = {}

		while True:
			r = requests.get('https://api.github.com/repos/' + full_name + '/' + dataType, headers= headers)
			myobj = r.json()
			if len(myobj) != 0:
				break

		
		p = Parser()
		return p.fmap[thrid](myobj)

class Parser:
	def __init__(self):
		self.fmap = {
			"stats-commit_activity" : self.commit_activity,
			"forks" : self.forks,
			"releases" : self.downloads,
			"issues" : self.issues
		}

	def issues(self, jsObj):
		pass
	def commit_activity(self, jsObj):
		js = {}
		js['weeks'] = []
		js['days'] = []
		for p in jsObj:
			js['weeks'].append(p['total'])
			js['days'].extend(p['days'])
		return json.dumps(js)

	def forks(self, jsObj):
		js = {}
		js['forks'] = 0

		for p in jsObj:
			if "id" in p:
				js['forks'] += 1
		return json.dumps(js)

	def downloads(self, jsObj):
		js = {}
		js['download']= 0

		for p in jsObj:
			if "assets" in p:
				for asset in p['assets']:
					js['download'] += asset['download_count']
		return json.dumps(js)


if __name__ == "__main__":
	app.run()
