import io from "socket.io-client/lib/index";
import URI from "urijs";
const socketArr = [];
class socket {
  constructor(options) {
    const {
      hostName,
      nameSpace,
      userCode,
      userType,
      refreshCallback
    } = options;
    if (!hostName) {
      const socketUri = joinPath(
        process.env.VUE_APP_WECHAT_SOCKET_HOST,
        "/socket/",
        nameSpace
      );
      this.socket = io(socketUri);
    } else {
      const socketUri = joinPath(hostName, "/socket/", nameSpace);
      this.socket = io(socketUri);
    }
    this.isConnected = false;
    socketArr.push(this.socket);
    this.socket.on("error", error => {
      this.isConnected = false;
      console.error("error", error);
    });
    this.socket.on("connect_error", error => {
      console.error("connect_error", error);
    });
    this.socket.on("connect_timeout", timeout => {
      console.warn("connect_timeout", timeout);
    });
    this.socket.on("connect", () => {
      this.isConnected = true;
      console.log("connectSucceed");
      this.socket.emit("register", {
        code: userCode,
        type: userType
      });
    });
    this.socket.on("disconnect", () => {
      this.isConnected = false;
    });
    this.socket.on("reconnect", () => {
      this.isConnected = true;
    });
    if (refreshCallback) {
      this.socket.on("refresh", refreshCallback);
    }
  }
  waitConnect(instance) {
    if (instance.isConnected) {
      return;
    } else {
      return new Promise(resolve => {
        instance.socket.once("connect", () => {
          resolve();
        });
      });
    }
  }

  closeAll() {
    const temp = [];
    socketArr.forEach(item => {
      if (item.close) {
        temp.push(item.close());
      }
    });
    return temp;
  }
}

const joinPath = function(origin, pathname, url) {
  return URI.joinPaths(pathname, url)
    .origin(origin)
    .toString();
};
export default socket;
