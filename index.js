import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

import {config} from './src/config/index.js';
import {router} from './src/routes/router.js';

const app = express();
app.use(express.json());
app.use(router);

app.use((err, req, res, next) => {
  console.error(err.stack); // Выводим стек ошибки в консоль
  res.status(500).send('Something broke!');
});

if (config.NODE_ENV !== 'production') {
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

export default app;
