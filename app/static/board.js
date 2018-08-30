


class Board{

    constructor (all_pieces=null, is_sente=null, board_history=null, legal_moves=null){

        if (all_pieces == null){

            let loc_piece_dict = generate_initial_loc_piece_dict();
            let pieces_in_hand_sente = {};
            let pieces_in_hand_gote = {};

            for (let piece_name of PieceName_Hand){
                pieces_in_hand_sente[piece_name] = 0;
                pieces_in_hand_gote[piece_name] = 0;
            }

            this.all_pieces = {
                "main" : loc_piece_dict,
                "hand" : {"sente" : pieces_in_hand_sente, "gote" : pieces_in_hand_gote}
            }

            this.is_sente = true;  // 手番
            this.board_history = [];  // 盤面の状態を毎回保存
            this.legal_moves = get_legal_moves(deepcopy_Board(this));  // 可能な指し手をだす
            this.board_history.push(deepcopy_Board(this));  // historyに追加
        }

        else{
            this.all_pieces = all_pieces;
            this.is_sente = is_sente;  // 手番
            this.board_history = board_history;  // 盤面の状態を毎回保存
            this.legal_moves = legal_moves;  // 可能な指し手をだす
        }

    }



    // def kif_str(this):

    //     kif_str = ""

    //     for row_num in range(1, 10):
    //         for col_num in range(1, 10)[::-1]:
                
    //             loc_str = str(col_num) + str(row_num)
    //             piece = this.all_pieces["main"][loc_str]

    //             if piece is None:
    //                 the_str = "n一"

    //             else:
    //                 piece_name = piece.name
    //                 is_sente = piece.is_sente
    //                 piece_name_kanji = PieceName_normal2kanji[piece_name]
    //                 if is_sente:
    //                     the_str = "a{}".format(piece_name_kanji)
    //                 else:
    //                     the_str = "v{}".format(piece_name_kanji)

    //             kif_str += the_str
            
    //         if row_num != 9:
    //             kif_str += "\n"

    //     return kif_str

    move(move){
        
        if ((move.length != 4) && (move.length != 5)){
            window.alert("kora");
            exit;
        }

        let loc_from = move.slice(0, 2);
        let loc_to = move.slice(2, 4);

        // その手が可能かチェック
        if (this.legal_moves.indexOf(move) < 0){
            window.alert("kora");
            exit;
        }

        // 手駒を打つ
        if (PieceName_Hand.indexOf(loc_from) >= 0){
            
            let piece_name = loc_from
            
            // 手駒から減らす
            if (this.is_sente){
                this.all_pieces["hand"]["sente"][piece_name] -= 1;
            }
            else{
                this.all_pieces["hand"]["gote"][piece_name] -= 1;
            }

            // 駒オブジェクトを生成して盤上に配置
            let the_piece = new Piece(piece_name, this.is_sente, loc_to);
            this.all_pieces["main"][loc_to] = the_piece;
        }


        // 駒を移動させる
        else{
            
            let piece = deepcopy_Piece(this.all_pieces["main"][loc_from]);
            piece.loc = loc_to;  // 位置を移動

            // 成る時
            if (move[move.length - 1] == "+"){
                piece.name = PieceName_before2after[piece.name];
            }

            // 駒をとる時
            let piece_there = this.all_pieces["main"][loc_to];

            if (piece_there != null){

                if (piece_there.is_sente == this.is_sente){
                    window.alert("kora");
                    exit;
                }


                // もし成り駒を取るときは名前を元に戻す
                if (PieceName_Nari.indexOf(piece_there.name) >= 0){
                    piece_there.name = PieceName_after2before[piece_there.name];
                }


                // 持ち駒に加える
                if (this.is_sente){
                    this.all_pieces["hand"]["sente"][piece_there.name] += 1;
                }
                else{
                    this.all_pieces["hand"]["gote"][piece_there.name] += 1;
                }

            }

            // 位置を移動
            this.all_pieces["main"][loc_from] = null;
            this.all_pieces["main"][loc_to] = piece;

        }


        // 手番を交代
        this.is_sente = !this.is_sente;

        // legal_movesを出しておく
        this.legal_moves = get_legal_moves(deepcopy_Board(this));


        // historyに追加
        // this.board_history.append(copy.deepcopy(this))

    }

    
    get_past(num){
        
        // num手目の盤面を返す
        
        return deepcopy_Board(this.board_history[num]);
    }
}


function deepcopy_Board(board){

    if (board.is_sente){var is_sente_copy = true;}else{var is_sente_copy=false;}
    var all_pieces_copy = deepcopy_all_pieces(board.all_pieces);
    var board_history_copy = $.extend(true, [], board.board_history);
    var legal_moves_copy = $.extend(true, [], board.legal_moves);

    let new_Board = new Board(all_pieces_copy, is_sente_copy, board_history_copy, legal_moves_copy);
    
    return new_Board;
}

function deepcopy_all_pieces(all_pieces){
    
    let main_copy = {};
    for (let key of Object.keys(all_pieces["main"])){
        let the_piece = all_pieces["main"][key];
        if (the_piece == null){
            main_copy[key] = null;
        }
        else{
            main_copy[key] = deepcopy_Piece(the_piece);
        }
    }
    // let main_copy = $.extend(true, {}, all_pieces["main"]);
    let sente_copy = $.extend(true, {}, all_pieces["hand"]["sente"]);
    let gote_copy = $.extend(true, {}, all_pieces["hand"]["gote"]);
    let hand_copy = {"sente" : sente_copy, "gote" : gote_copy};

    return {"main" : main_copy, "hand" : hand_copy};
}