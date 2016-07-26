import urllib

import web
import os
import sys
import requests
import json
import cStringIO
paths = (
  '/api/stat/reponame', 'GithubData'
)

app = web.application(paths, globals())


class GithubData:
	def GET(self, slash=False):

		web.header( 'Content-Type',
            'application/json' )
		headers = {}
		full_name='Microsoft/WindowsProtocolTestSuites'

		buf = cStringIO.StringIO()
		r = requests.get('https://api.github.com/repos/' + full_name + '/downloads', headers= headers)
		myobj = r.json()
		return myobj




if __name__ == "__main__":
	app.run()
