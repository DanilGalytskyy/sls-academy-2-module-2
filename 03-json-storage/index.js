const express = require('express');
const { putRequest, getRequest } = require('./controllers/requestController');


const app = express();
const port = 3000;
app.use(express.json());

app.put('/:json_path', putRequest);

app.get('/:json_path', getRequest);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});