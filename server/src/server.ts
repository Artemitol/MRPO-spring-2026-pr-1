import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.info(`Server started at http://localhost:${env.port}`);
});
