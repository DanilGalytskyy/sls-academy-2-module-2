const { join } = require('path');
const fs = require('fs');

const dataBaseDir = join(__dirname, '..', 'dataBase');

function putRequest(req, res) {
    try {
        const jsonData = req.body;
        const jsonPath = req.params.json_path;
        const filePath = join(dataBaseDir, `${jsonPath}.json`);

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                fs.writeFile(filePath, JSON.stringify([jsonData]), (err) => {
                    if (err) {
                        res.status(500).json({ error: 'Error saving data' });
                    } else {
                        res.status(200).json(jsonData);
                    }
                });
            } else {
                let users = [];

                if (data) {
                    users = JSON.parse(data);
                }
                users.push(jsonData);
                fs.writeFile(filePath, JSON.stringify(users), (err) => {
                    if (err) {
                        res.status(500).json({ error: 'Error adding data' });
                    } else {
                        res.status(200).json(users);
                    }
                });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

function getRequest(req, res) {
    try {
        const jsonPath = req.params.json_path;
        const filePath = join(dataBaseDir, `${jsonPath}.json`);
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(500).json({ error: 'JSON document not found' });
            } else {
                res.status(200).json(JSON.parse(data));
            }
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

module.exports = {
    putRequest,
    getRequest,
};