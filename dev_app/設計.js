// 基底のhistory
// シナリオは入れ子構造にしていく
// それぞれ盤面の状態を持つようにする

var base_history = [
    {"move" : "12"},
    {"move" : "34"},
    {
        "scenarios" : [
            [{"move" : "kore"}, {"move" : "one"}, {"move" : "oneone"}],
            [{"move" : "hoge"}, {"move" : "two"}],
            [{"move" : "aa"} , {"move" : "three"}]
        ],
        "selected_scenario" : 2,
    }
];


// d3に渡す用のデータを作成

final_dataset = [
    // 関数の中で、最初にここから
    {"move" : "12", "parent" : base_history, "order_in_parent" : 0},
    {"move" : "34", "parent" : base_history, "order_in_parent" : 1},
    {"scenarios" : base_history[2]["scenarios"], "selected_scenario" : 2, "parent" : base_history, "order_in_parent" : 2},
    // ここまで加わる

    // 次に以下を順に加える
    {"move" : "aa", "parent" : base_history[2]["scenarios"][2], "order_in_parent" : 0},
    {"move" : "three", "parent" : base_history[2]["scenarios"][2], "order_in_parent" : 1}
];


// todo : 新たな分岐を加えるテストをする
// before
history_before_branch = {
    "scenarios" : [
        [{"move" : "kore"}, {"move" : "one"}],
        [{"move" : "hoge"}, {"move" : "two"}, {"move" : "twoo"}],
        [{"move" : "aa"} , {"move" : "three"}]
    ],
    "selected_scenario" : 0
}

// // after

history_after_branch = {
    "scenarios" : [
        [{"move" : "kore"}, {"move" : "one"}],
        [{"move" : "hoge"}, {"scenarios" : [
            [{"move" : "two"}, {"move" : "twoo"}],  // 元々のアクション
            [{"move" : "new"}]]}  // 新たな分岐
        ],
        [{"move" : "aa"} , {"move" : "three"}]
    ],
    "selected_scenario" : 0
}

// 参照しているのが親のi番目だったとすると、親のi番目に{"scenarios":}を加え、中の値は新しいactionだけ含まれるシナリオと、元のi番目以降全て


function add_action(action){

    // まず、historyに追加する

    // もし新たな分岐が必要ない場合
    if (! need_new_branch){
        this.watching_action["parent"].splice(this.watching_action["order_in_parent"]+1, 0, action);
    }

    else{
        let order_in_parent = this.watching_action["order_in_parent"];
        let parent = this.watching_action["parent"];
        // 新しいシナリオアクション
        let new_scenario_action = {
            "scenarios" : [
                [this.watching_action.slice(order_in_parent+1, parent.length-1)], // 今参照しているアクションより後のhistory
                [action]
            ],
            "parent" : this.watching_action["parent"],
            "order_in_parent" : order_in_parent + 1
        }
        this.watching_action["parent"] = parent.slice(0, order_in_parent+ 1)  // 参照していたアクション以前のhistory
        this.watching_action["parent"].push(new_scenario_action);  // 作成したシナリオアクションを追加
    }

    update_d3();
}



// watching_action, watching_dom, 背景色について

// ・アクションに"is_watching"キーをセット＋trueなら描画時に色を青に
// ・クリック時とアクション追加時：
//     元のアクション："is_watching"をfalseに＋背景色を色に戻す
//     クリックされたアクション：History.watching_action, History.watching_domをこれに上書き＋背景を青に（クリック時はdomを直接変更、追加時は"is_waching"で描画時に青に）
