import express from 'express';
import { sendSampleData } from './dataService.js';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello from Golem-base!');
});

app.get('/load-data', async (req, res) => {
    await sendSampleData()
    return 'OK';
})

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

