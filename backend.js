import express from 'express';
import api from './static/js/api.js';

const app = express();
const port = 3000;

app.use(express.static('static'));

app.use('/api', api);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
