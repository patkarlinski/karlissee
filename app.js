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

app.get('/download', async (req, res) => {
    const fileName = 'Karlinski_Patryk_cv.pdf';
    const filePath = path.resolve(__dirname, 'files', fileName);

    try {
        await fs.promises.access(filePath, fs.constants.F_OK);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (err) {
        res.status(err.code === 'ENOENT' ? 404 : 500)
           .send(err.code === 'ENOENT' ? 'Plik nie znaleziony' : 'Błąd serwera');
    }
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
