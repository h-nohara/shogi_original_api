// save画面へ
$(document).on("click", "#save", function(){
    window.open('http:///localhost:8090/to_save_window');
})

// load画面へ
$(document).on("click", "#load", function(){
    window.open('http:///localhost:8090/to_load_window');
})


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

            History.history = received_history;

            // boardを最新に
            Board.get_board_from_server();

            // history_viewを最新に
            History.now_clicked_id = "ActionButton_" + String(History.history.length - 1);
            History.update_view();
        })
        .fail(function(jqXHR, textStatus, errorThrown){
                console.log("failed load");
        });
}


// save
function save_history(without_ext){

    // historyを送信
    $.ajax(
        {
          url : '/save/' + without_ext,
          type : 'POST',
          data : JSON.stringify(History.history),
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

