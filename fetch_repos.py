import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request("https://api.github.com/users/OLAMIGHTY010/repos")
req.add_header('User-Agent', 'Mozilla/5.0')
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        data = json.loads(response.read().decode())
        for r in data:
            print(f"{r.get('name')}|{r.get('description')}|{r.get('html_url')}|{r.get('language')}")
except Exception as e:
    print("Error:", e)
