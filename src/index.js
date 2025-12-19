import express from "express";
import cors from "cors";
import { executeQuery } from "./config/database.js"

const app = express();

// Middleware JSON
app.use(express.json());

//Middleware CORS
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).send("OK");
});

// Rotas
app.get("/requisicao", function (req, res) {
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
        )
    `;

    filtro.push(telBusca, telBusca);

    console.log("Telefone normalizado:", telBusca);
}
   
    executeQuery(ssql, filtro, function (err, result) {
        if (err) {
            console.error(err);
            res.status(500).json(err);
        } else {
            res.status(200).json(result);
        }
    });
});
    
app.get("/pcp", function(req, res)
{
    let filtro = [];
    let ssql = "SELECT req.dtentr, req.cdcli, req.nomepa, req.nrrqu, req.serier, pcp.cdetapa, pcp.data, pcp.hora, eta.descricao FROM FC12100 req LEFT JOIN (SELECT p1.cdfil, p1.nrrqu, p1.serier, p1.cdetapa, p1.data, p1.hora FROM FC12500 p1 JOIN (SELECT p2.nrrqu, p2.serier, p2.cdfil, MAX(CAST(p2.data AS VARCHAR(10)) || ' ' || CAST(p2.hora AS VARCHAR(15))) AS max_datahora FROM FC12500 p2 WHERE p2.cdopera = 01 GROUP BY p2.nrrqu, p2.serier, p2.cdfil) ult ON p1.nrrqu = ult.nrrqu AND p1.serier = ult.serier AND p1.cdfil = ult.cdfil AND (CAST(p1.data AS VARCHAR(10)) || ' ' || CAST(p1.hora AS VARCHAR(15))) = ult.max_datahora WHERE p1.cdopera = 01) pcp ON req.cdfil = pcp.cdfil AND req.nrrqu = pcp.nrrqu AND req.serier = pcp.serier INNER JOIN FC12540 eta ON pcp.cdetapa = eta.cdetapa WHERE req.DTENTR >= current_date - 120 AND req.tpformafarma NOT IN (7, 8) AND req.cdfil = 1 and req.NRRQU > 0";

    if (req.query.NRRQU){
        ssql += " and req.NRRQU = ?";
        filtro.push(req.query.NRRQU);
    }

    executeQuery(ssql, filtro, function(err, result)
    {
            if (err)
            {
                res.status(500).json(err);
            }
            else 
            {
                res.status(200).json(result);
            } 
    }
)   
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor no ar na porta ${PORT}`);
});
