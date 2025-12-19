import express from "express";
import cors from "cors";
import { executeQuery } from "./config/database.js";

const app = express();

// Middleware JSON
app.use(express.json());

// Middleware CORS
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// 🔹 Rota /requisicao
app.get("/requisicao", async (req, res) => {
  try {
    let filtro = [];
    let ssql = `
      SELECT DISTINCT
          req.CDFIL,
          req.DTENTR,
          req.NRRQU,
          req.SERIER,
          itm.DESCR,
          req.VOLUME,
          req.UNIVOL
      FROM FC12100 req
      INNER JOIN FC12110 itm
          ON req.CDFIL = itm.CDFIL
         AND req.NRRQU = itm.NRRQU
         AND req.SERIER = itm.SERIER
      INNER JOIN FC07000 cli ON req.CDCLI = cli.CDCLI
      INNER JOIN FC07200 c   ON cli.CDCLI = c.CDCLI
      WHERE req.DTENTR > current_date - 180
        AND itm.ITEMID = 1
    `;

    if (req.query.NRTEL) {
      let tel = req.query.NRTEL.replace(/\D/g, '');
      if (tel.startsWith('55')) tel = tel.substring(2);

      const ddd = tel.substring(0, 2);
      let numero = tel.substring(2);

      const numeroFormatado = numero.padStart(9, '0');
      const telBusca = ddd + numeroFormatado;

      ssql += `
        AND (
          TRIM(LPAD(TRIM(c.NRDDD), 2, '0') || LPAD(TRIM(c.NRTEL), 9, '0')) = ?
          OR TRIM(LPAD(TRIM(c.NRDDD2), 2, '0') || LPAD(TRIM(c.NRTEL2), 9, '0')) = ?
          OR TRIM(LPAD(TRIM(c.NRDDDFAX), 2, '0') || LPAD(TRIM(c.NRF