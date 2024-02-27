const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: 'instantclient_21_13' });//需要安裝 Microsoft Visual Studio 2017 Redistributable

const app = express();
const port = process.env.PORT || 3755;
const dbConfig = {
    user: '使用者帳號',
    password: '使用者密碼',
    connectString: '連接字串',
};

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/scan', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'scan.html'));
});
app.get('/api/assetList', async (req, res) => {
    const { employeeId } = req.query;

    try {
        // 建立資料庫連線
        const connection = await oracledb.getConnection(dbConfig);

        // 執行查詢
        const result = await connection.execute(
            'SELECT FANUMB,FAASID,FADL01,FADL02 FROM PRODDTA.F1201 WHERE FAAN8 = :id',
            { id: "1" + employeeId }
        );

        // 釋放資料庫連線
        await connection.close();
        //console.log(result.rows)
        // 回傳查詢結果
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
