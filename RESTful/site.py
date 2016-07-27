import urllib

import web
import requests
import json
import cStringIO

paths = (
  '/api/(.+)/(.+)/(.+)', 'GithubData'
)

app = web.application(paths, globals())


class GithubData:
	def GET(self, first, second, thrid):
		full_name =  first + '/' + second
		dataType = thrid.replace('-', '/')
		headers = {}
		r = requests.get('https://api.github.com/repos/' + full_name + '/' + dataType, headers= headers)
		myobj = r.json()
		
		p = Parser()
		return p.fmap[thrid](myobj)

class Parser:
	def __init__(self):
		self.fmap = {
			"stats-commit_activity" : self.commit_activity,
			"forks" : self.forks,
			"downloads" : self.downloads,
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
		InternalUserList=[
        'https://api.github.com/repos/VivianTian/WindowsProtocolTestSuites', 
        'https://api.github.com/repos/caoyihua/WindowsProtocolTestSuites',
        'https://api.github.com/repos/chenlu0616/WindowsProtocolTestSuites',
        'https://api.github.com/repos/yihuac/WindowsProtocolTestSuites',
        'https://api.github.com/repos/JessieF/WindowsProtocolTestSuites',
        'https://api.github.com/repos/Dingshouqing/WindowsProtocolTestSuites',
        'https://api.github.com/repos/yazeng/WindowsProtocolTestSuites',
        'https://api.github.com/repos/XiaotianLiuMS/WindowsProtocolTestSuites',
        'https://api.github.com/repos/dongruiqing/WindowsProtocolTestSuites',
        'https://api.github.com/repos/VictorDingSQ/WindowsProtocolTestSuites',
        'https://api.github.com/repos/LiuXiaotian/WindowsProtocolTestSuites',
        ]
        internal_forks_total_count = 0
        external_forks_total_count = 0
		for p in jsObj:
			if "id" in p:
				if p['url'] in InternalUserList:			
					internal_forks_total_count += 1
				else:
					external_forks_total_count += 1
		    else:
				print "No Data"
		js = {}
		js['internal'] = internal_forks_total_count
		js['external'] = external_forks_total_count
		return json.dumps(js)

	def downloads(self, jsObj):
		pass



if __name__ == "__main__":
	app.run()
