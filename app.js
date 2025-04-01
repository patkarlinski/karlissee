const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Serwowanie plików statycznych (HTML, CSS, JS, obrazy)
app.use(express.static(path.join(__dirname, 'public')));

// Strona główna
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Strona 'about'
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/download', (req, res) => {
    const filePath = path.join(__dirname, 'files', 'Karlinski_Patryk_cv.pdf');
    fs.exists(filePath, (exists) => {
        if (exists) {
            res.download(filePath, 'Karlinski_Patryk_cv.pdf');
        } else {
            res.status(404).send('Plik nie znaleziony');
        }
    });
});



app.get('/sitemap.xml', (req, res) => {
    const filePath = path.join(__dirname, 'sitemap.xml');
    res.sendFile(filePath);
})

// Jeśli nie ma pasującej trasy, zwróć 404
app.use((req, res) => {
    res.status(404).send('Nie znaleziono zasobu');
});

// Uruchomienie serwera
app.listen(3000, () => {
    console.log("Serwer uruchomiony na porcie 3000");
});
