import {Room, SocketActions, SocketClient, SocketParams, SocketVO} from "./type";

const Clients = new Map<string, SocketClient>();
const Rooms = new Map<number, Room>();
function send(target: string | WebSocket, params: SocketParams) {
  const ws = typeof target === "string" ? Clients.get(target).ws : target;
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
  getRooms(ws) {
    send(ws, {
      type: "connect",
      msg: "连接成功",
      data: Array.from(Rooms),
    });
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
