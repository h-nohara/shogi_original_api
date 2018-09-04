

PieceName_all = ["OU", "HI", "KA", "KI", "GI", "KE", "KY", "FU", "RY", "UM", "NG", "NK", "NY", "TO"];
PieceName_notNari = ["OU", "HI", "KA", "KI", "GI", "KE", "KY", "FU", ];
PieceName_Nari = ["RY", "UM", "NG", "NK", "NY", "TO"];
PieceName_Hand = ["HI", "KA", "KI", "GI", "KE", "KY", "FU"];


PieceName_normal2kanji = {
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

PieceName_before2after = {
    "HI" : "RY",
    "KA" : "UM",
    "GI" : "NG",
    "KE" : "NK",
    "KY" : "NY",
    "FU" : "TO",
};

PieceName_after2before = {
    "RY" : "HI",
    "UM" : "KA",
    "NG" : "GI",
    "NK" : "KE",
    "NY" : "KY",
    "TO" : "FU"
};

number2kanji = {
    1 : "一", 2: "二", 3 : "三", 4 : "四", 5 : "五", 6 : "六", 7 : "七", 8 : "八", 9 : "九"
};


// 初期盤面（メイン）を生成

function generate_initial_loc_piece_dict(){
    
    let loc_piece_dict = {};

    for (let row_num=1; row_num<10; row_num++){

        for (let col_num=1; col_num<10; col_num++){
            
            let loc_str = String(col_num) + String(row_num);

            if (row_num > 5){
                is_sente = true;
            }
            else{
                is_sente = false;
            }

            if ((loc_str == "51") || (loc_str == "59")){
                loc_piece_dict[loc_str] = new Piece("OU", is_sente);
            }

            else if ((loc_str == "41") || (loc_str == "61") || (loc_str == "49") || (loc_str == "69")){
                loc_piece_dict[loc_str] = new Piece("KI", is_sente);
            }

            else if ((loc_str == "31") || (loc_str == "71") || (loc_str == "39") || (loc_str == "79")){
                loc_piece_dict[loc_str] = new Piece("GI", is_sente);
            }

            else if ((loc_str == "21") || (loc_str == "81") || (loc_str == "29") || (loc_str == "89")){
                loc_piece_dict[loc_str] = new Piece("KE", is_sente);
            }

            else if ((loc_str == "11") || (loc_str == "91") || (loc_str == "19") || (loc_str == "99")){
                loc_piece_dict[loc_str] = new Piece("KY", is_sente);
            }

            else if ((loc_str == "82") || (loc_str == "28")){
                loc_piece_dict[loc_str] = new Piece("HI", is_sente);
            }

            else if ((loc_str == "22") || (loc_str == "88")){
                loc_piece_dict[loc_str] = new Piece("KA", is_sente);
            }

            else if ((row_num == 3) || (row_num == 7)){
                loc_piece_dict[loc_str] = new Piece("FU", is_sente);
            }

            else{
                loc_piece_dict[loc_str] = null;
            }
        }
    }

    for (loc of Object.keys(loc_piece_dict)){
        if (loc_piece_dict[loc] != null){
            loc_piece_dict[loc].loc = loc;
        }
    }

    return loc_piece_dict

}


function get_move_str(move, piece_name){

    // get_move_str("8822+", "KA")  : "２二角成"
    // get_move_str("55", "HI") : "５五飛打"


    let move_str = move[2] + number2kanji[Number(move[3])] + PieceName_normal2kanji[piece_name];


    // 打ち手だったら
    if (PieceName_Hand.indexOf(move[0] + move[1]) >= 0){
        move_str = move_str + "打"
    }

    else{
        if (move[move.length-1] == "+"){
            move_str = move_str[0] + move_str[1] + PieceName_normal2kanji[PieceName_after2before[piece_name]] + "成";
        }
    }

    return move_str
}