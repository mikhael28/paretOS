/* eslint-disable no-console */
export class WS {
  socketRef: WebSocket | null;

  path: string;

  connectInterval: ReturnType<typeof setTimeout> | any;

  processMsg: Function | null | (() => {});

  timeout: number;

  static instance: WS | null = null;

  static getInstance() {
    if (!WS.instance) WS.instance = new WS();
    return WS.instance;
  }

  constructor(path: string = "", processMsg: Function | null = () => { }) {
    this.socketRef = null;
    this.path = path;
    this.connectInterval = null;
    this.processMsg = processMsg;
    this.timeout = 5000;
  }

  connect({ path, processMsg }: any) {
    // Close old connection if new connect call would create a duplicate
    if (this.socketRef) {
      this.socketRef.close(3000);
      this.socketRef = null;
    }
    const ws = new WebSocket(path);

    ws.onmessage = (message: any) => {
      processMsg(message);
    };

    ws.onclose = (e) => {
      clearTimeout(this.connectInterval || 0);
      this.timeout = 250;
      if (e.code !== 3000) {
        // we are trying to reconnect again if offline, with a limited backoff period
        console.log(
          `Socket is closed. Reconnect will be attempted in ${Math.min(
            10000 / 1000,
            (this.timeout * 2) / 1000
          )} seconds.`,
          e.reason
        );
        this.waitForConnection();
      }
    };

    ws.onerror = (err: any) => {
      // eslint-disable-next-line no-alert
      alert(`Socket encountered error: ${err.message}`);
      console.log("Closing Socket");

      ws?.close();
    };
    this.socketRef = ws;
  }

  isOpen() {
    return this.socketRef?.readyState === 1;
  }

  send(payload: any) {
    if (this.isOpen() && this.socketRef) {
      this.socketRef.send(payload);
    } else {
      this.socketRef?.close(3000);
      this.connect({ path: this.path, processMsg: this.processMsg });
      this.waitForConnection(125);
      this.socketRef?.send(payload);
    }
  }

  waitForConnection(startingTimeout = 125) {
    if (startingTimeout * 2 < 10000) this.timeout = startingTimeout * 2;
    setTimeout(() => {
      if (this.isOpen()) {
        console.log("Connected");
        clearTimeout(this.connectInterval);
        this.connectInterval = setInterval(() => {
          // console.log("Firing Ping");
          if (this.isOpen()) {
            this.socketRef?.send(`{"action":"sendmessage", "data":"ping" }`);
          }
        }, 400000);
        return;
      }
      console.log("Waiting for connection...");
      this.waitForConnection(this.timeout);
    }, startingTimeout);
  }
}

export default WS.getInstance();
