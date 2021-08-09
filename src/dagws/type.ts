type ActionsFn = (ws: WebSocket, res: SocketVO) => void;
export interface SocketActions {
  connect: ActionsFn;
  getRooms: ActionsFn;
}
export type SocketActionsEnum = keyof SocketActions;
export interface SocketData<T = any> {
  [key: string]: T;
  [key: number]: T;
}
export interface SocketVO<T = SocketData> {
  type: SocketActionsEnum;
  msg: string;
  data: T;
  name: string;
}
export type SocketParams = Partial<SocketVO>;

export interface UserInfo {
  name: string;
}
export interface SocketClient {
  ws: WebSocket;
  user: UserInfo;
}
