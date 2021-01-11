const express = require('express');
const { join } = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/public', express.static(join(__dirname, 'public')));
app.use(express.static(join(__dirname, 'public/pages'),{ extensions:['html'] }));

app.get('/robots.txt', (_req, res) => {
    res.sendFile(join(__dirname, 'robots.txt'));
});

app.get('*', (_req, res) => {
    res.redirect('/');
})

app.listen(PORT, () => {
    console.log(`The server is listening on port ${PORT}`);
})