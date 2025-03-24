const http = require("http");
const fs = require("fs");
const path = require("path");

http.createServer(function (req, res) {
    if (req.url == '/') {
        // Jeśli zapytanie dotyczy głównej strony, zwróć plik HTML
        fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Błąd serwera');
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    } else if (req.url.endsWith('.css')) {
        // Serwowanie pliku CSS
        fs.readFile(path.join(__dirname, 'public', req.url), (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Nie znaleziono pliku CSS');
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.end(data);
        });
    } else if (req.url.endsWith('.js')) {
        // Serwowanie pliku JS
        fs.readFile(path.join(__dirname, 'public', req.url), (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Nie znaleziono pliku JS');
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/javascript'});
            res.end(data);
        });
    } else {
        // Dla innych plików (np. obrazków) zwróć 404
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Nie znaleziono zasobu');
    }
}).listen(3000, () => {
    console.log("Server started on port 3000");
});