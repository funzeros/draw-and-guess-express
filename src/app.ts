import express from "express";
import expressWs from "express-ws";
import wsRuntime from "./dagws/index";
import {loadEnv} from "./util/env";
const {PORT} = loadEnv();
// 初始化连接数据库
// express
const appBase = express();
// websocket
const wsInstance = expressWs(appBase);
const {app} = wsInstance;

app.ws("/dagws", (ws: any) => {
  wsRuntime(ws);
});

app.listen(PORT, () => {
  console.log(`服务已启动--> http://127.0.0.1:${PORT}`);
});
