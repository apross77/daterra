import express from "express";
import cors from "cors";
import { executeQuery } from "./config/database.js"

const app = express();

// Middleware JSON
app.use(express.json());

//Middleware CORS
app.use(cors());

// Rotas
app.get("/requisicao", function(req, res)
{
    let filtro = [];
    let ssql = "SELECT DISTINCT	req.CDFIL, req.DTENTR, req.NRRQU, req.SERIER, itm.DESCR, req.VOLUME, req.UNIVOL FROM FC12100 req INNER JOIN FC12110 itm	ON (req.CDFIL = itm.CDFIL AND req.NRRQU = itm.NRRQU AND req.SERIER = itm.SERIER) INNER JOIN FC07000 cli ON (req.CDCLI = cli.CDCLI) INNER JOIN FC07200 c ON (cli.CDCLI = c.CDCLI) WHERE req.DTENTR > current_date - 120 and itm.ITEMID = 1 and (trim(c.NRDDD))||(trim(c.NRTEL)) <> ''";

        if (req.query.NRTEL){
        ssql += " and (trim(c.NRDDD))||(trim(c.NRTEL)) like ?";
        filtro.push("%" + req.query.NRTEL + "%");
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
app.get("/pcp", function(req, res)
{
    let filtro = [];
    let ssql = "SELECT req.dtentr, req.cdcli, req.nomepa, req.nrrqu, req.serier, pcp.cdetapa, pcp.data, pcp.hora, eta.descricao FROM FC12100 req LEFT JOIN (SELECT p1.cdfil, p1.nrrqu, p1.serier, p1.cdetapa, p1.data, p1.hora FROM FC12500 p1 JOIN (SELECT p2.nrrqu, p2.serier, p2.cdfil, MAX(CAST(p2.data AS VARCHAR(10)) || ' ' || CAST(p2.hora AS VARCHAR(15))) AS max_datahora FROM FC12500 p2 WHERE p2.cdopera = 01 GROUP BY p2.nrrqu, p2.serier, p2.cdfil) ult ON p1.nrrqu = ult.nrrqu AND p1.serier = ult.serier AND p1.cdfil = ult.cdfil AND (CAST(p1.data AS VARCHAR(10)) || ' ' || CAST(p1.hora AS VARCHAR(15))) = ult.max_datahora WHERE p1.cdopera = 01) pcp ON req.cdfil = pcp.cdfil AND req.nrrqu = pcp.nrrqu AND req.serier = pcp.serier INNER JOIN FC12540 eta ON pcp.cdetapa = eta.cdetapa WHERE req.DTENTR >= current_date - 120 AND req.tpformafarma NOT IN (7, 8) AND req.cdfil = 1 and req.NRRQU > 0";

    if (req.query.NRRQU){
        ssql += "and req.NRRQU = ?";
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

app.listen(3000, '0.0.0.0', function()
{
    console.log("Servidor no ar");
});