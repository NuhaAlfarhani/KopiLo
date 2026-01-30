const express = require('express');
const path = require('path');
const app = express();
const frontendDir = path.resolve(__dirname, '../../frontend');

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendDir, index.html));
});