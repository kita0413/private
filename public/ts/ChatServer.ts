///<reference path="./modules/wsserver.ts" />

//-------------ChatServerクラスの定義------------------
class ChatServer extends WSServer.Server {
    constructor(port: number){
        super(port);
        //サーバがLISTEN状態になった際に発生するイベントのハンドラ
        this.on('listen', (port) => { console.log('サーバ起動：' + port);});

        var gp = new WSServer.Group(this);
        gp.on('connect', (socket: Socket) => { console.log('クライアントが接続');});
        gp.on('message', (socket: WebSocket, message) => {
            console.log(message);
            gp.emit('message', message);
        });
        gp.on('disconnect', (socket: Socket) => { console.log('クライアントが切断');});
    }
}



//ChatServerクラスをインスタンス化
var cs = new ChatServer(8888);
cs.start();     //サーバをLISTEN状態にする→listenイベントが発生する