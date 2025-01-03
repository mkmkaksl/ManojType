const express = require("express");
const cors = require('cors');
const PORT = 3001;

const app = express();
app.use(cors());

app.get('/music', (req, res) => {
    res.send({
        name: "Hello World"
    })
})

app.listen(PORT, () => {
    console.log("LISTENING FROM NODE");
})
