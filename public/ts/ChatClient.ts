///<reference path="./modules/wsclient.ts" />

//ChatClientクラスを定義
class ChatClient extends WSClient.Client{
    //--------メンバ変数宣言----------------------------
    private output: HTMLElement = document.getElementById('output');    //ejsのoutputをidに付けたdiv内に表示するメッセージを保持するための変数
    private group: WSClient.Group;      //サーバとの通信用グループを保持するための変数
    private name: string = "";      //ハンドル名を保持するための変数

    //-------コンストラクタ----------------------------------
    constructor(server: string, port: number){  //server=このクライアントが接続するIPアドレス、client=ポート番号
        super(server, port);    //親クラスコンストラクタの呼び出し

        //ハンドル名を確認(確認画面でOKが押されるまでプロンプトが出され続ける)
        do{
            this.name = prompt('ニックネームを入力してください', this.name);
        }while(!confirm('「' + this.name + '」でよろしいですか？'));

        var gp = new WSClient.Group(this);      //グループを作成
        this.group = gp;

        //グループにイベントハンドラを設定
        gp.on('connect', () => {this.showMessage('ようこそ ' + this.name + 'さん'); });
        gp.on('message', (fromMessage) => {
            var from = fromMessage.from;      //ハンドル名の取り出し
            var message = fromMessage.message;      //メッセージの取り出し
            this.showMessage(from + ': ' + message);
        })

        //gp.on('message', (message) => {this.showMessage(message); });
        gp.on('disconnect', () => {this.showMessage('チャットを終了しました');});
    }


    //-------------メソッド-------------------------------------------------------
    //サーバにメッセージを送信
    public sendMessage(message:string):void{      //設定したグループにメッセージを送る
        this.group.emit('message',{ from: this.message, message:message});
    } 


    //メッセージをブラウザに表示
    private showMessage(message:string):void{ this.output.innerHTML += message + '<br>';}   //新たに送信されてきたメッセージを既存のメッセージの下に追加して表示させる
}




//ChatClientクラスをインスタンス化
var cc: ChatClient;

//ブラウザで送信ボタンが押された際に呼び出される関数、引数としてブラウザのフォームに入力されたメッセージを受け取る
function sendMessage(obj: Object){
    var message = obj.comment.value;        //送られてきたメッセージを取得（ejs上でnameにcommentを指定した領域の値を取得）
    cc.sendMessage(message);        //ChatClientクラスで定義したsendMessageメソッドを呼び出す(文字列をサーバに送信)
    obj.comment.value='';       //ejs上でnameにcommentを指定した領域の値を空にする
}

//チャットページが読み込まれた際に呼び出される、ccに新たなChatClientインスタンスを代入しチャットを開始する
window.onload = () =>{
    cc = new ChatClient(location.hostname, 8888){
        cc.start();
    }
}