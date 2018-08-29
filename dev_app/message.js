// メッセージアクションをヒストリーに追加

$(document).on("click", "#AddAction", function(){

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

    let text = $("#TextAction_text_box").val();
    let LightUp_pos_str = $("#" + "LightUpAction_buttons p").text();
    let Mark_pos_str = $("#" + "MarkAction_buttons p").text();

    let action = History.watching_action;

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
    pass;
})


// それぞれのアクションを足すボタンを押した時
$(document).on("click", ".one_action_add_button", function(){
    SBoard.now_is_adding_action = !SBoard.now_is_adding_action;
    if (SBoard.now_is_adding_action){
        $(".OneSquare").css("background-color", "gold");
        let adding_action_kind = this.id.split("_")[1];
        SBoard.now_is_adding_kind = adding_action_kind;
    }
    else{
        $(".OneSquare").css("background-color", SBoard.default_color);
    }
})


// それぞれのアクションを消すボタンを押した時
$(document).on("click", ".one_action_reflesh_button", function(){
    let adding_action_kind = this.id.split("_")[1]; // "LightUp" or "Mark"
    $("#" + adding_action_kind + "Action_buttons" + " p").text("");
})

