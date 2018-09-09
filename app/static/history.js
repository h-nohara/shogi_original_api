

function update_d3(dataset){

    d3.select("#history_scroll").selectAll(".OneAction").remove();
    d3.select("#sub_scenarios").selectAll(".sub_sc").remove();

    console.log("dataset");
    console.log(dataset);


    d3.select("#history_scroll").selectAll(".OneAction")

    .data(dataset)
    .enter()
    .append("div")
    .append("button")
    .attr("class", "OneAction")

    // ボタンのテキスト
    .text(function(action){
        let keys = Object.keys(action);
        if (keys.indexOf("move") >= 0){
            return action["move_str"];
        }
        else if (keys.indexOf("message") >= 0){
            return "message";
        }
        else if (keys.indexOf("scenarios") >= 0){
            return "branch";
        }
        else if (keys.indexOf("fly_to") >= 0){
            return "fly_to";
        }
        else {
            return "other";
        }
    })

    // ボタンの色
    .style("background-color", function(action){

        if (Object.keys(action).indexOf("scenarios") >= 0){
            return "red";
        }
        else if(Object.keys(action).indexOf("is_watching") >= 0){
            if (action["is_watching"] === true){
                History.watching_dom = this;
                return "blue";
            }
            else{
                return "white";
            }
        }
    })

    // ボタンがクリックされたら
    .on("click", function(action){

        // 将棋盤の状態を元に戻す
        SBoard.init_state_now();

        // クリックされているボタンと背景色を更新

        History.watching_action["is_watching"] = false;
        $(History.watching_dom).css("background-color", "white");

        History.watching_action = action;
        History.watching_dom = this;
        $(this).css("background-color", "blue");


        // シナリオ分岐ボタンを押したら
        if (Object.keys(action).indexOf("scenarios") >= 0){

            d3.select("#sub_scenarios")
            .selectAll(".sub_sc")
            .data(action["scenarios"])
            .enter()
            .append("div")
            .append("button")
            .attr("class", "sub_sc")
            .text(function(act){
                return act[0]["move"];
            })
            .on("click", function(sub_sc, i_sub_sc){

                action["selected_scenario"] = i_sub_sc;

                var emp_list = [];
                list_showing_actions(History.history, emp_list);
                update_d3(emp_list);
            });

        }

        // それ以外のボタンを押したら
        else{
            
            // メッセージの各項目を代入
            show_message_contents(action);

            // parentを表示
            console.log("parent");
            console.log(action["parent"]);
        }

        
        // 盤面をその時の状態に
        SBoard.Board = deepcopy_Board(action["board_state"]);
        SBoard.draw_main_board();
        
    });
}

var emp_list = [];


function list_showing_actions(history, result_list){

    for (let i=0; i<history.length; i++){

        let action = history[i];

        // // 分岐の表示だったら
        // if (Object.keys(action).indexOf("scenarios") >= 0){

        //     result_list.push({"scenarios" : action["scenarios"], "original" : action});
        //     let mini_history = action["scenarios"][action["selected_scenario"]];
            
        //     list_showing_actions(mini_history, result_list);
        // }
        // // それ以外だったら
        // else {
        //     action["parent"] = history;
        //     action["order_in_parent"] = i;
        //     result_list.push(action);
        // }

        action["parent"] = history;
        action["order_in_parent"] = i;
        result_list.push(action);

        if (Object.keys(action).indexOf("scenarios") >= 0){
            let mini_history = action["scenarios"][action["selected_scenario"]];
            list_showing_actions(mini_history, result_list);
        }
    }
}



class HistoryHandler{

    constructor(){

        this.history = [];

        let initial_action = {
            "move" : "initial",
            "move_str" : "initial",
            "parent" : this.history,
            "order_in_parent" : 0,
            "board_state" : deepcopy_Board(SBoard.Board),
            "is_watching" : true
        };
        this.history.push(initial_action);

        this.watching_action = this.history[0];
        this.watching_dom = null;

        list_showing_actions(this.history, emp_list);

        update_d3(emp_list);

    }



    add_action(action, is_fly_to=false){

        // 以前見ていたもの
        $(History.watching_dom).css("background-color", "white");
        this.watching_action["is_watching"] = false;


        // 新たなブランチを作成する　：　親の最新でないアクションを見ている時にmoveアクションが追加されたら
        if ((Object.keys(action).indexOf("move") >= 0) && (History.watching_action["order_in_parent"] != History.watching_action["parent"].length - 1)){

            this.make_branch(action);
        }

        // サブシナリオを追加する
        else if (Object.keys(this.watching_action).indexOf("scenarios") >= 0){
            this.add_branch(action);
        }

        else{

            // まず、historyに追加する
            if (is_fly_to){
                this.watching_action["parent"].push(action);
            }
            else{
                this.watching_action["parent"].splice(this.watching_action["order_in_parent"]+1, 0, action);
            }
        }

        // 見ているものを更新
        this.watching_action = action;
        action["is_watching"] = true;
        
        this.update_view();
        show_message_contents(action);

    }

    add_action_before(action){

        // 手前にアクションを追加する

        // 今はメッセージアクションだけ
        if (Object.keys(action).indexOf("message") < 0){
            console.log("okasiine");
            exit;
        }

        // 以前見ていたもの
        $(History.watching_dom).css("background-color", "white");
        this.watching_action["is_watching"] = false;

        // historyに追加
        this.watching_action["parent"].splice(this.watching_action["order_in_parent"], 0, action);

        // 見ているものを更新
        this.watching_action = action;
        action["is_watching"] = true;
        
        this.update_view();
        show_message_contents(action);

    }

    make_branch(action){

        let order_in_parent = this.watching_action["order_in_parent"];
        let after_watching_action = this.watching_action["parent"].slice(order_in_parent+1);
        

        // 新しいシナリオアクション
        let new_scenario_action = {
            "scenarios" : [
                after_watching_action, // 今参照しているアクションより後のhistory
                [action]
            ],
            "parent" : this.watching_action["parent"],
            "order_in_parent" : order_in_parent + 1,
            "selected_scenario" : 1,
            "board_state" : deepcopy_Board(this.watching_action["board_state"])
        };


        this.watching_action["parent"].splice(order_in_parent+1, this.watching_action["parent"].length-(order_in_parent+1));
        this.watching_action["parent"].push(new_scenario_action);  // 作成したシナリオアクションを追加

    }

    add_branch(action){

        // もしすでにブランチが存在していたら、そこに加える

        let new_sc = [action];
        this.watching_action["scenarios"].push(new_sc);
        this.watching_action["selected_scenario"] = this.watching_action["scenarios"].length - 1;
    }


    update_view(){
        emp_list = [];
        list_showing_actions(this.history, emp_list);
        update_d3(emp_list);
    }
}




function show_message_contents(action){

    let keys = Object.keys(action);

    if (keys.indexOf("message") >= 0){
        
        let message_action = action["message"];
        let message_keys = Object.keys(message_action);

        // テキスト
        var el = "#TextAction_text_box";
        if (message_keys.indexOf("text") >= 0){
            $(el).val(message_action["text"]);
        }
        else{
            $(el).val("");
        }

        // ライトアップ
        var el = "#LightUpAction_buttons p";
        if (message_keys.indexOf("light_up") >= 0){
            $(el).text(message_action["light_up"].join(","));
        }
        else{
            $(el).text("");
        }

        // マーク
        var el = "#MarkAction_buttons p";
        if (message_keys.indexOf("mark") >= 0){
            $(el).text(message_action["mark"].join(","));
        }
        else{
            $(el).text("");
        }
    }

    else {
        $("#TextAction_text_box").val("");
        $("#LightUpAction_buttons p").text("");
        $("#MarkAction_buttons p").text("");
    }
}




// メッセージを見ている時


function show_effects(reset_color=true){

    // reset_color : 最初に各マス目の色を元に戻す（以前のアクションによる着色をリセットするため）か、戻さない（マークの追加時など）か

    if (reset_color){
        $(".OneSquare").css("background-color", SBoard.default_color);
    }

    let watching_action = History.watching_action;


    // メッセージアクションだったら、背景とマークの位置を着色

    if (Object.keys(watching_action).indexOf("message") >= 0){

        let message = watching_action["message"];

        if (Object.keys(message).indexOf("light_up") >= 0){
            for (let loc_light_up of message["light_up"]){
                $("#" + loc_light_up).css("background-color", "pink");
            }
        }

        if (Object.keys(message).indexOf("mark") >= 0){
            for (let loc_mark of message["mark"]){
                $("#" + loc_mark).css("background-color", "lightcyan");
            }
        }
    }

    else if (Object.keys(watching_action).indexOf("move") >= 0){
        let loc = watching_action["move"][2] + watching_action["move"][3];
        $("#" + loc).css("background-color", "brown");
    }
}


$(document)
    // .on("mouseenter", ".OneAction", function(){
    //     let watching_action = History.watching_action;
    //     if (Object.keys(watching_action).indexOf("message") >= 0){
    //         let message = watching_action["message"];
    //         if (Object.keys(message).indexOf("light_up") >= 0){
    //             for (let loc_light_up of message["light_up"]){
    //                 $("#" + loc_light_up).css("background-color", "pink");
    //             }
    //         }
    //         if (Object.keys(message).indexOf("mark") >= 0){
    //             for (let loc_mark of message["mark"]){
    //                 $("#" + loc_mark).css("background-color", "lightcyan");
    //             }
    //         }
    //     }
    // })
    // .on("mouseleave", ".OneAction", function(){
    //     $(".OneSquare").css("background-color", SBoard.default_color);
    // })
    .on("click", ".OneAction", show_effects)




// 常に監視する関数たち


function open_or_close_sub_sc(){
    let watching_action = History.watching_action;
    if (Object.keys(watching_action).indexOf("scenarios") >= 0){
        open_pull();
    }
    else{
        close_pull();
    }
}
