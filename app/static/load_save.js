// save画面へ
$(document).on("click", "#save", function(){
    window.open('http:///localhost:8090/to_save_window');
})

// load画面へ
$(document).on("click", "#load", function(){
    window.open('http:///localhost:8090/to_load_window');
})


// todo loadした時にparentを設定し直す
// load
function load_history(without_ext){

    // historyを受け取る
    $.ajax(
        {
          url : '/load/' + without_ext,
          type : 'GET',
        //   dataType: 'json',
        //   contentType: 'application/json'
        })
        .done(function(received_history){

            History.history = received_history["history"];
            set_parent(History.history);  // parentを各アクションに設定

            // history_viewを最新に
            History.watching_action = History.history[0];
            History.watching_action["is_watching"] = true;
            History.update_view();

            // boardを最新に
            SBoard.Board = History.watching_action["board_state"];
            SBoard.draw_main_board();

        })
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log("failed load");
        });
}


// save
function save_history(without_ext){

    let new_history = [];
    let history_copy = copy_history_without_parent(History.history, new_history);

    // コピーした時にオリジナルhistoryのparentが削除されてしまったので、再設定
    set_parent(History.history);

    // historyを送信
    $.ajax(
        {
          url : '/save/' + without_ext,
          type : 'POST',
          data : JSON.stringify({"history" : history_copy}),
        //   dataType: 'json',
        //   contentType: 'application/json'
        })
        .done(function(no_data){
            window.alert("保存しました");
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log("failed save");
        });
}




// 動画生成
$(document).on("click", "#finish", function(){

    console.log("start make movie");

    let new_history = [];
    let history_copy = copy_history_without_parent(History.history, new_history);

    // コピーした時にオリジナルhistoryのparentが削除されてしまったので、再設定
    set_parent(History.history);

    $.ajax({
        url : "/make_movie",
        type : "POST",
        data: JSON.stringify({"history" : history_copy}),
        timeout: 1000 * 600
    })
    .done(function(no_data){
        console.log("pushed to python make image");
        window.alert("動画を生成しました");
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        console.log("oh my image");
    })
})




function copy_history_without_parent(history, new_history){

    for (let action of history){
        delete action["parent"];

        if (Object.keys(action).indexOf("scenarios") >= 0){
            for (let i = 0; i<action["scenarios"].length; i++){
                let mini_sc = action["scenarios"][i];
                let the_new = [];
                action["scenarios"][i] = copy_history_without_parent(mini_sc, the_new);
            }
        }

        let action_copy = $.extend(true, {}, action);
        new_history.push(action_copy);
    }

    return new_history;
}


function set_parent(history){

    for (let action of history){

        action["parent"] = history;

        if (Object.keys(action).indexOf("scenarios") >= 0){
            for (let mini_sc of action["scenarios"]){
                set_parent(mini_sc);
            }
        }
    }
}