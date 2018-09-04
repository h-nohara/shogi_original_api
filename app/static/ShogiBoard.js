var PieceNames_normal_NotNari = ["HI", "KA", "KI", "GI", "KE", "KY", "FU"];
var PieceName_normal2kanji = {
    "OU" : "王",
    "HI" : "飛",
    "KA" : "角",
    "KI" : "金",
    "GI" : "銀",
    "KE" : "桂",
    "KY" : "香",
    "FU" : "歩",
    "RY" : "龍",
    "UM" : "馬",
    "NG" : "成銀",
    "NK" : "成桂",
    "NY" : "成香",
    "TO" : "と"
};


function DictKeys_to_String(dict){

    console.log("transforming");

    let new_dict = {};

    for (key in dict){
        key_string = key.toString();
        new_dict[key_string] = dict[key];
    }

    return new_dict;
}


class ShogiBoard {

    constructor(){

        console.log("constructer start");

        this.Board = new Board();

        this.default_color = "antiquewhite";

        
        // ユーザの操作の現在
        this.now_is_touched = false;
        this.now_touched_loc = null;


        // アクションを足している最中かどうか
        this.now_is_adding_action = false;
        this.now_is_adding_kind = null;  // "LightUp" or "Mark"


        // 初期配置を描画
        this.draw_main_board_base();
        this.draw_sub_board_base();

        this.draw_main_board();
    }



    // ユーザの操作の現在をリセット

    init_state_now(){
        
        this.now_is_touched = false;
        this.now_touched_loc = null;
    }

    // todo
    reset(){
        pass;
    }


    
    // pythonから盤面の状況を辞書で取得して反映

    draw_main_board(){

        console.log("start draw main");

        for (let key of Object.keys(this.Board.all_pieces["main"])){
            let piece = this.Board.all_pieces["main"][key];
            if (piece != null){
                if (piece.is_sente){
                    $("#"+key).text(PieceName_normal2kanji[piece.name]);
                }
                else{
                    $("#"+key).text("v" + PieceName_normal2kanji[piece.name]);
                }
            }
            else{
                $("#"+key).text("");
            }
        
        }

        // サブボードを更新
        this.draw_sub_board();
    }

    draw_sub_board(){

        console.log("start draw sub_board");

        for (let i=0; i<2; i++){

            if (i == 0){
                var PieceDict = this.Board.all_pieces["hand"]["sente"];
            }
            else{
                var PieceDict = this.Board.all_pieces["hand"]["gote"];
            }

            for (let PieceName in PieceDict){
                let the_id = "#"+PieceName+String(i);
                let the_text = PieceName_normal2kanji[PieceName]+":"+PieceDict[PieceName];
                $(the_id).text(the_text);
            }
        }
    }

    // メインボードのベースを描画
    draw_main_board_base(){
        for (var loc_y=1; loc_y<=9; loc_y++){
            for (var x=1; x<=9; x++){
                var loc_x = 10 - x;
                var btn = document.createElement("button");
                var Loc = String(loc_x) + String(loc_y);
                // btn.innerHTML = Loc;
                btn.id = Loc;
                btn.className = "OneSquare";
                btn.style.backgroundColor = this.default_color;
                btn.style.color = "black";
                btn.style.fontSize = "120%";
                document.getElementById("main_board").appendChild(btn);
            }
        }

        console.log("base drawed");
    }

    // サブボードのベースを描画
    draw_sub_board_base(){

        // 手駒のidは "HI0"　のような形式（０：先手、１：後手）
        for (let i=0; i<2; i++){

            if (i==0){var sente_or_gote = "sente";} else{var sente_or_gote = "gote";}

            // let PieceDict = this.LocPieceDict_sub[i];
            for (let PieceName of PieceNames_normal_NotNari){
                let btn = document.createElement("button");
                btn.id = PieceName + String(i);
                btn.innerHTML = PieceName;
                btn.className = "PieceInHand";
                btn.style.backgroundColor = this.default_color;
                btn.style.color = "black";
                btn.style.fontSize = "180%";
                document.getElementById("sub_board_" + sente_or_gote).appendChild(btn);
            }
        }
    }

    // draw_sub_board_base(){

    // }

    child_clicked(Loc){

        // もしアクションを足している最中だったら

        console.log("child clicked");
        console.log(History.history);

        if (this.now_is_adding_action){

            let el = "#" + this.now_is_adding_kind + "Action_buttons";
            let before_text = $(el + " p").text();

            if (before_text != ""){before_text += ",";}
            let after_text = before_text + Loc;
            $(el + " p").text(after_text);
        }

        // そうでなく、普通の駒の操作だったら

        else{

            console.log("clicked :" + Loc);

            // 事前に駒がクリックされていた時
            if (this.now_is_touched){

                console.log("year, was touched");
                let legal_moves = this.Board.legal_moves;

                let this_move = this.now_touched_loc + Loc;


                // 移動可能な場所がクリックされたら
                if ((legal_moves.indexOf(this_move) >= 0) || (legal_moves.indexOf(this_move + "+") >= 0)){

                    console.log("I can move there!");

                    // 成るか成らないか選べる時は選択ウィンドウを出し、その後の処理はウィンドウウィジェット側で行う
                    if ((legal_moves.indexOf(this_move) >= 0) && (legal_moves.indexOf(this_move+"+") >= 0)){

                        this.check_nari(this.now_touched_loc, Loc);
                    }

                    // 選べない時
                    else{

                        // 成れない時は自動でそのまま

                        // 必ず成らなければいけない時
                        if ((legal_moves.indexOf(this_move) == -1) && (legal_moves.indexOf(this_move+"+") >= 0)){
                            Loc = Loc + "+";
                        }

                        this.push_and_reflect_and_init_user_state(this.now_touched_loc, Loc);
                    }
                }

                // 移動可能でない場所がクリックされたら
                else {

                    console.log("oh , I cant move there");
                    
                    // 背景を元に戻す
                    $(".OneSquare").css("background-color", this.default_color);

                    // ユーザの操作状況を反映
                    this.now_touched_loc = Loc;

                    // todo
                    this.draw_legal_moves(Loc);
                }
            }


            // どこもクリックされていなかった時

            else{

                console.log("not touched");
                
                // ユーザの操作状況を反映
                this.now_is_touched = true;
                this.now_touched_loc = Loc;
                this.draw_legal_moves(Loc);
            }

        }

    }


    

    // 移動可能な場所を描画

    draw_legal_moves(Loc){

        console.log("start draw legal_moves");

        console.log(this.Board.legal_moves);

        for (let move of this.Board.legal_moves){
            let loc_from = move[0] + move[1];
            let loc_to = move[2] + move[3];
            if (loc_from == Loc){
                $("#"+loc_to).css("background-color", "gold");
            }
        }
    }


    

    push_and_reflect_and_init_user_state(start_loc, destination_loc){

        let move = start_loc + destination_loc;
        this.Board.move(move);  // 駒を動かす
        // this.Board = deepcopy_Board(this.Board);
        this.draw_main_board();  // 画面に反映

        // ユーザの状態を元に戻す
        this.init_state_now();
        // 背景を元に戻す
        $(".OneSquare").css("background-color", this.default_color);


        let move_str = get_move_str(move, this.Board.all_pieces["main"][destination_loc[0]+destination_loc[1]].name);
        
        // ヒストリーに追加
        let action = {"move" : move, "board_state" : deepcopy_Board(this.Board), "move_str" : move_str};

        console.log("before add_action");
        console.log(History.history);
        History.add_action(action);
    }


    check_nari(start_loc, dest_loc){

        if (confirm("成りますか？")) {
            dest_loc = dest_loc + "+";
        }
        
        this.push_and_reflect_and_init_user_state(start_loc, dest_loc);
    }

}




// 駒がタッチされたら

$(document).on("click", ".OneSquare", function(){
    let Loc = this.id;
    console.log("hogehoge");
    console.log(History.history);
    SBoard.child_clicked(Loc);
});

$(document).on("click", ".PieceInHand", function(){
    console.log("clicked tegoma");
    if (((this.id[2] == "0") && SBoard.Board.is_sente) || ((this.id[2] == "1") && (!SBoard.Board.is_sente))){
        let Loc = this.id[0]+ this.id[1];
        SBoard.child_clicked(Loc);
    }
})
