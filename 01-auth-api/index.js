import express from 'express';
import routes from './routes/userRoutes.js'

const app = express();
const port = 3000;
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
