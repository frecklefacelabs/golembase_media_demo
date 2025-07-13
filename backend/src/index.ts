import express from 'express';
import { sendSampleData } from './dataService.js';

const app = express();
const port = 3000;

let item:any = {
  "data_value": "A lunar revolution with libertarian flair",
  "annotations": {
    "type": "book",
    "title": "The Moon is a Harsh Mistress",
    "author": "Robert A. Heinlein",
    "genre": "science fiction",
    "rating": 5,
    "owned": true,
    "year": 1966
  }
};

await sendSampleData();

// Basic route
// app.get('/', (req, res) => {
//   res.send('Hello from Freckleface Express!');
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

