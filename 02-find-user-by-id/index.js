import express from 'express';
import { findUserCountryByIp } from './controllers/countryController.js';

const app = express();
const port = 3000;

app.get('/findUserCountryByIp', findUserCountryByIp);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});