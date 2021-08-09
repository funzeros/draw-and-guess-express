import {SocketActions, SocketClient, SocketParams, SocketVO} from "./type";

const Clients = new Map<string, SocketClient>();
function send(target: string, params: SocketParams) {
  const ws = Clients.get(target).ws;
  ws.send(JSON.stringify(params));
}
const socketActions: SocketActions = {
  connect(ws, res) {
    const {name} = res;
    const user = {name};
    // if(Clients.has(name)){
    // }
    Clients.set(name, {ws, user});
    send(name, {
      type: "connect",
      msg: "连接成功",
      data: {state: "rooming"},
    });
  },
  getRooms(ws, res) {
    console.log(res);
  },
};

const useWS = (ws: WebSocket, res: SocketVO) => {
  if (res.type in socketActions) socketActions[res.type](ws, res);
};
const wsRuntime = (ws: any) => {
  ws.on("message", (e: any) => {
    const res = JSON.parse(e);
    useWS(ws, res);
  });
};
export default wsRuntime;
