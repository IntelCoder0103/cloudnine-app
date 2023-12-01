import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import ReportController from './controllers/report.controller';
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/report', ReportController);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.info(`Started server on ${port}`);
});