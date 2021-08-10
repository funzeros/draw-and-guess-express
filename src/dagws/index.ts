import {Room, SocketActions, SocketClient, SocketParams, SocketVO, UserInfo} from "./type";

const Clients = new Map<string, SocketClient>();
let roomCount = 0;
const Rooms = new Map<number, Room>();

function send(target: string | WebSocket, params: SocketParams) {
  const ws = typeof target === "string" ? Clients.get(target).ws : target;
  ws.send(JSON.stringify(params));
}

function broadcast(targetList: (string | WebSocket)[], params: SocketParams) {
  targetList.forEach(m => {
    send(m, params);
  });
}

const useMap = <K, V>(CMap: Map<K, V>) => {
  return {
    getArray() {
      return Array.from(CMap, ([k, v]) => ({k, v}));
    },
    getArrayV() {
      return Array.from(CMap, ([, v]) => v);
    },
    getArrayK() {
      return Array.from(CMap, ([k]) => k);
    },
    map<T>(cb: (p: [K, V]) => T) {
      return Array.from(CMap, cb);
    },
  };
};
const ClientsFn = useMap(Clients);
const RoomsFn = useMap(Rooms);
const broadcastRooms = () =>
  broadcast(
    ClientsFn.map(([, v]) => v.ws),
    {
      type: "getRoomList",
      data: RoomsFn.getArrayV(),
    }
  );
const socketActions: Partial<SocketActions> = {
  connect(ws, res) {
    const {name} = res;
    const user: UserInfo = {name, state: "rooming", roomId: 0};
    let clientUser = {};
    if (Clients.has(name)) {
      clientUser = Clients.get(name).user;
    }
    Clients.set(name, {ws, user: {...clientUser, ...user}});
    send(name, {
      type: "connect",
      msg: "连接成功",
      data: {state: "rooming"},
    });
    broadcastRooms();
    ws.onclose = () => {
      if (!Clients.has(name)) return;
      const client = Clients.get(name);
      if (["gaming"].includes(client.user.state)) {
        // 如果玩家在游戏中 保留玩家游戏状态
        client.ws = undefined;
        return;
      }
      const roomId = client.user.roomId;
      if (roomId) {
        // 如果玩家在房间中并且不是游戏中
        const room = Rooms.get(roomId);
        const i = room.player.findIndex(m => m === name);
        // 从房间中删除玩家
        if (i > -1) room.player.splice(i, 1);
        // 如果房间人数为0 删除房间
        if (!room.player.length) {
          Rooms.delete(roomId);
          return;
        }
        // 如果房间还在并且玩家是房主，更换房主
        if (room.owner === name) {
          room.owner = room.player[0];
        }
      }
      // 客户端集合中从移除玩家
      Clients.delete(name);
    };
  },
  createRoom(ws, res) {
    const client = Clients.get(res.name);
    const roomId = client.user.roomId;
    if (roomId) {
      const room = Rooms.get(roomId);
      send(ws, {type: "enterRoom", data: room});
      return;
    }
    const id = ++roomCount;
    const room: Room = {
      id,
      player: [res.name],
      status: "waiting",
      owner: res.name,
    };
    client.user.state = "waiting";
    client.user.roomId = id;
    Rooms.set(id, room);
    send(ws, {type: "enterRoom", data: room});
    broadcastRooms();
  },
  enterRoom(ws, res) {
    const {roomId} = res.data;
    if (!Rooms.has(roomId)) return;
    const room = Rooms.get(roomId);
    room.player.push(res.name);
    const client = Clients.get(res.name);
    client.user.roomId = roomId;
    client.user.state = "waiting";
    send(ws, {type: "enterRoom", data: room});
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
