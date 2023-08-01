import express from 'express';
import connectDB from './config/db.js';
import routes from './routes/url.js'
const app = express();

connectDB();
app.use('/', routes);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});