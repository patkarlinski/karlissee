const http = require("http");
const fs = require("fs");
const path = require("path");

http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Błąd serwera');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.url === '/about') {
        fs.readFile(path.join(__dirname, 'public', 'about.html'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Błąd serwera');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.url === '/download') {
        const filePath = path.join(__dirname, 'files', 'Karlinski_Patryk_cv.pdf');
        fs.exists(filePath, (exists) => {
            if (exists) {
                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': 'attachment; filename="Karlinski_Patryk_cv.pdf"'
                });
                const fileStream = fs.createReadStream(filePath);
                fileStream.pipe(res);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Plik nie znaleziony');
            }
        });
    } else if (req.url.endsWith('.css')) {
        fs.readFile(path.join(__dirname, 'public', req.url), (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Nie znaleziono pliku CSS');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        });
    } else if (req.url.endsWith('.js')) {
        fs.readFile(path.join(__dirname, 'public', req.url), (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Nie znaleziono pliku JS');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Nie znaleziono zasobu');
    }
}).listen(3000, () => {
    console.log("Serwer uruchomiony na porcie 3000");
});
