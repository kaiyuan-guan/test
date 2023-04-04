// 引入http、mysql、body-parser和express模块
const http = require('http');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const express = require('express');

// 定义主机名和端口号
const hostname = '127.0.0.1';
const port = 3000;

// 创建MySQL数据库连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'Taobao'
});

// 创建express应用实例
const app = express();

// 使用body-parser中间件来解析请求体
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 处理POST请求，将接收到的数据插入到MySQL数据库中
app.post('/test.html', (req, res) => {
    // 从请求体中获取数据
    const data = req.body.data;
    // 从连接池中获取连接
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            // 如果获取连接失败，返回500状态码和错误信息
            res.status(500).send('Error connecting to MySQL database');
        } else {
            // 如果获取连接成功，定义SQL语句，将数据插入到mytable表中
            const sql = `INSERT INTO mytable (data) VALUES ('${data}')`;
            // 执行SQL语句
            connection.query(sql, (err, result) => {
                connection.release(); // 释放连接
                if (err) {
                    console.log(err);
                    // 如果插入数据时发生错误，返回500状态码和错误信息
                    res.status(500).send('Error inserting data into MySQL database');
                } else {
                    // 如果插入数据成功，返回200状态码和成功信息
                    res.status(200).send('Data inserted into MySQL database');
                }
            });
        }
    });
});

// 启动服务器，监听指定的主机名和端口号
const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
