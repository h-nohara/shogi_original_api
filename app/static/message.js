// メッセージアクションをヒストリーに追加

$(document).on("click", "#AddAction", function(){

    SBoard.init_state_now();

    let text = $("#TextAction_text_box").val();
    let LightUp_pos_str = $("#" + "LightUpAction_buttons p").text();
    let Mark_pos_str = $("#" + "MarkAction_buttons p").text();

    let action = {"message" : {}, "board_state" : deepcopy_Board(SBoard.Board)};

    if ((text != null) && (text != "")){
        action["message"]["text"] = text;
    }
    if ((LightUp_pos_str != null) && (LightUp_pos_str != "")){
        action["message"]["light_up"] = LightUp_pos_str.split(",");
    }
    if ((Mark_pos_str != null) && (Mark_pos_str != "")){
        action["message"]["mark"] = Mark_pos_str.split(",");
    }


    History.add_action(action);
    show_message_contents(action);

})


// メッセージアクションの内容を更新

$(document).on("click", "#UpdateAction", function(){

    let action = History.watching_action;

    // 現在参照しているのがメッセージアクションかチェック
    if (Object.keys(action).indexOf("message") < 0){
        window.alert("メッセージアクションにのみ適用できます");
        exit;
    }

    let text = $("#TextAction_text_box").val();
    let LightUp_pos_str = $("#" + "LightUpAction_buttons p").text();
    let Mark_pos_str = $("#" + "MarkAction_buttons p").text();

    if ((text != null) && (text != "")){
        action["message"]["text"] = text;
    }
    else{
        delete action["message"]["text"];
    }

    if ((LightUp_pos_str != null) && (LightUp_pos_str != "")){
        action["message"]["light_up"] = LightUp_pos_str.split(",");
    }
    else{
        delete action["message"]["light_up"];
    }

    if ((Mark_pos_str != null) && (Mark_pos_str != "")){
        action["message"]["mark"] = Mark_pos_str.split(",");
    }
    else{
        delete action["message"]["mark"];
    }


    show_message_contents(action);
    
})



// fly_toアクションを追加

$(document).on("click", "#add_FlyTo", function(){

    // 現在参照しているのがmessageだったらエラーを出す
    if (Object.keys(History.watching_action).indexOf("message") > 0){
        window.alert("メッセージのところにfly_toは追加できません");
        exit;
    }

    let action = {"fly_to" : null, "board_state" : deepcopy_Board(SBoard.Board)};
    History.add_action(action, true);
})



// アクションを削除
$(document).on("click", "#DelAction", function(){

    SBoard.init_state_now();

    let order = History.watching_action["order_in_parent"];

    if (order == 0){

        // initialは削除できない
        if (Object.keys(History.watching_action).indexOf("move") >= 0){
            if (History.watching_action["move"] == "initial"){
                window.alert("最初は削除できません");
                exit;
            }
        }

        // サブシナリオの最初を削除したら

        // 見ているもの以降を削除
        History.watching_action["parent"].splice(order);

        History.history = handle_emp_scenario(History.history);

       // 画面更新
       History.update_view();
       show_message_contents(History.watching_action);
       SBoard.Board = deepcopy_Board(History.watching_action["board_state"]);
       SBoard.draw_main_board();

    }

    else{
        // 見ているものを更新
        History.watching_action = History.watching_action["parent"][order-1];
        History.watching_action["is_watching"] = true;

        // 見ているもの以降を削除
        History.watching_action["parent"].splice(order);
        
        // 画面更新
        History.update_view();
        show_message_contents(History.watching_action);
        SBoard.Board = deepcopy_Board(History.watching_action["board_state"]);
        SBoard.draw_main_board();
    }
    
})


function handle_emp_scenario(history){

    // ブランチを削除した時（ブランチの最初のアクションを削除した時）に、historyを編集

    for (let i=0; i<history.length; i++){
        let action = history[i];

        // シナリオアクションを見つけたら
        if (Object.keys(action).indexOf("scenarios") >= 0){
            let emp_sc_number = null;
            let n_sub_sc = action["scenarios"].length;

            for (let j=0; j<n_sub_sc; j++){
                sub_sc = action["scenarios"][j];

                // 空のシナリオだったら
                if (sub_sc.length == 0){
                    emp_sc_number = j;
                    break;
                }
                // 空じゃなかったら、そのシナリオの中身を同じようにチェック
                else{
                    action["scenarios"][j] = handle_emp_scenario(sub_sc);
                }
            }
            // 空のシナリオを見つけていたら
            if (emp_sc_number != null){
                if (n_sub_sc >= 3){
                    action["scenarios"].splice(emp_sc_number, 1);
                }
                else{
                    let survive_sub_sc_number = Math.abs(action["selected_scenario"] - 1);  // 現在見ているのと別の方のシナリオ
                    if (survive_sub_sc_number > 1){
                        window.alert("koara");
                        exit;
                    }
                    let tail_actions = action["scenarios"][survive_sub_sc_number];
                    for (let tail_action of tail_actions){
                        tail_action["parent"] = history;
                    }

                    history.splice(-1);  // ブランチアクションを削除（親の最後)
                    history = history.concat(tail_actions); // 確認　見ていない方のサブシナリオを親の最後に加える

                    History.watching_action = history[i-1];
                    History.watching_action["is_watching"] = true;
                }
            }
        }
    }

    return history;
}




// メッセージエフェクトを足すボタンを押した時
$(document).on("click", ".one_action_add_button", function(){
    SBoard.now_is_adding_action = !SBoard.now_is_adding_action;
    if (SBoard.now_is_adding_action){
        $(".OneSquare").css("background-color", "gold");
        show_effects(false);
        let adding_action_kind = this.id.split("_")[1];
        SBoard.now_is_adding_kind = adding_action_kind;
    }
    else{
        // $(".OneSquare").css("background-color", SBoard.default_color);
        show_effects();
    }
})


// メッセージエフェクトを消すボタンを押した時
$(document).on("click", ".one_action_reflesh_button", function(){
    let adding_action_kind = this.id.split("_")[1]; // "LightUp" or "Mark"
    $("#" + adding_action_kind + "Action_buttons" + " p").text("");
})

