import http.server
import urllib.request
import urllib.parse

PORT = 8000
TARGET_API = "https://true-call-check.vercel.app/api/web/lookup"

class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/lookup'):
            # Query parameter extract karein
            parsed_path = urllib.parse.urlparse(self.path)
            query = urllib.parse.parse_qs(parsed_path.query)
            num = query.get('num', [''])[0]
            
            if not num:
                self.send_error(400, "Missing 'num' parameter")
                return

            # Backend ko request bhejein (Origin header ke saath)
            req_url = f"{TARGET_API}?num={num}"
            req = urllib.request.Request(req_url)
            req.add_header('Origin', 'https://truecallcheck.tech') # Official origin
            req.add_header('User-Agent', 'Mozilla/5.0')
            
            try:
                with urllib.request.urlopen(req) as response:
                    data = response.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(data)
            except urllib.error.HTTPError as e:
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(e.read())
            except Exception as e:
                self.send_error(500, str(e))
        else:
            # Baaki requests normal file serving ke liye
            super().do_GET()

if __name__ == '__main__':
    server = http.server.HTTPServer(('localhost', PORT), ProxyHandler)
    print(f"Proxy server running on http://localhost:{PORT}")
    print("Ab apna HTML tool isi folder me rakhein aur http://localhost:8000/afzal_lookup.html kholen")
    server.serve_forever()