

// potential_moves { 駒が本来動ける方向
// natural_moves { 王手されていることを考えない、可能な指し手
// legal_moves { 可能な指し手


// function get_legal_move_chunk_inner(moves, Board, loc_of_OU){
    
//     let legal_moves = [];
    
//     for (move of moves){
    
//         if ((move.length != 4) && (move.length != 5)){
//             exit;
//         }

//         let ||iginal_piece = Board.all_pieces["main"][move.slice(0, 2)];

//         if (||iginal_piece == null){
//             exit;
//         }
        

//         // 駒を移動
//         let board_copy = copy.deepcopy(Board);
//         board_copy.all_pieces["main"][move.slice(0, 2)] = null;
//         new_piece = new Piece(||iginal_piece.name, ||iginal_piece.is_sente);
//         new_piece.loc = move.slice(2, 4);
//         board_copy.all_pieces["main"][move.slice(2, 4)] = new_piece;

//         if (new_piece.name == "OU"){
//             var loc_of_OU_now = new_piece.loc;
//         }
//         else{
//             var loc_of_OU_now = loc_of_OU;
//         }

//         // 手番を交代
//         board_copy.is_sente = !board_copy.is_sente;

//         let natural_moves_enemy = get_all_natural_moves(board_copy);
//         let natural_moves_dest_enemy = [];
//         for (move of natural_moves_enemy){
//             natural_moves_dest_enemy.push(move.slice(2, 4));
//         }

//         if (natural_moves_dest_enemy.indexOf(loc_of_OU_now) < 0){
//             legal_moves.push(move);
//         }

//     return legal_moves
// }


// function get_legal_move_chunk(args){
//     return get_legal_move_chunk_inner(*args)
// }




// function _get_legal_moves(Board, loc=null){
    
//     s = time.time()
    
//     // natural_movesを取得
    
//     natural_moves = get_all_natural_moves(Board)

//     e = time.time()

    
//     // もしそれぞれのlegal_moveを行った場合、玉が相手の駒にattackされている状態になっていないかチェックする

//     for piece in Board.all_pieces["main"]loc_piece_dict{
//         if piece is not null{
//             if (piece.name == "OU") && (piece.is_sente == Board.is_sente){
//                 loc_of_OU = piece.loc

//     legal_moves = []

//     prNumber(natural_moves)

//     prNumber("="*20)
//     prNumber(Board.all_pieces["main"]["99"].loc)

//     ss = time.time()

//     length = len(natural_moves)
//     one = Number(length/3)
//     move_chunks = [(natural_moves[{one], Board, loc_of_OU), (natural_moves[one{one*2] ,Board, loc_of_OU), (natural_moves[one*2{],Board, loc_of_OU)]

//     p = Pool(4)
//     legal_moves = p.map(get_legal_move_chunk, move_chunks)
//     legal_moves = list(chain.from_iterable(legal_moves))


//     ee = time.time()

//     prNumber(e -s)
//     prNumber(ee-ss)

//     return legal_moves





function get_legal_moves(Board, loc=null){
    
    // s = time.time();
    
    // natural_movesを取得
    
    var natural_moves = get_all_natural_moves(Board);

    // e = time.time();

    
    // もしそれぞれのlegal_moveを行った場合、玉が相手の駒にattackされている状態になっていないかチェックする

    // 玉の位置を見つける

    let loc_piece_dict = Board.all_pieces["main"];
    if (Board.is_sente){
        var sente_or_gote = "sente";
    }
    else{
        var sente_or_gote = "gote";
    }
    let pieces_in_hand = Board.all_pieces["hand"][sente_or_gote];

    for (key of Object.keys(loc_piece_dict)){
        let piece = loc_piece_dict[key];
        if (piece != null){
            if ((piece.name == "OU") && (piece.is_sente == Board.is_sente)){
                var loc_of_OU = $.extend(true, [], [piece.loc])[0];
            }
        }
    }

    let legal_moves = [];


    // ss = time.time()

    for (move of natural_moves){

        // console.log(move);

        if ((move.length != 4) && (move.length != 5)){
            window.alert(move);
            exit;
        }

        var board_copy = deepcopy_Board(Board);

        // 駒の移動だったら

        if (PieceName_all.indexOf(move.slice(0, 2)) < 0){

            let original_piece = Board.all_pieces["main"][move.slice(0, 2)];
            
            if (original_piece == null){
                window.alert(move);
                window.alert(PieceName_all.indexOf(move.slice(0, 2)));
                exit;
            }

            
            // 駒を移動

            board_copy.all_pieces["main"][move.slice(0, 2)] = null;
            let new_piece = deepcopy_Piece(original_piece);
            new_piece.loc = move.slice(2, 4);
            board_copy.all_pieces["main"][move.slice(2, 4)] = new_piece;

            if (new_piece.name == "OU"){
                var loc_of_OU_now = new_piece.loc;
            }
            else{
                var loc_of_OU_now = loc_of_OU;
            }
        }
        // 打ち手だったら
        else{
            let the_piece_name = move.slice(0, 2);
            if (pieces_in_hand[the_piece_name] <= 0){
                window.alert("tarinai");
                exit;
            }
            board_copy.all_pieces["hand"][sente_or_gote][the_piece_name] -= 1;
            board_copy.all_pieces["main"][move.slice(2, 4)] = new Piece(the_piece_name, $.extend(true, [], [board_copy.is_sente])[0], move.slice(2, 4));
        }



        // 手番を交代
        board_copy.is_sente = !board_copy.is_sente;

        let natural_moves_enemy = get_all_natural_moves(board_copy);
        let natural_moves_dest_enemy = [];
        for (let move_enemy of natural_moves_enemy){
            natural_moves_dest_enemy.push(move_enemy.slice(2, 4));
        }
        if (natural_moves_dest_enemy.indexOf(loc_of_OU_now) < 0){
            legal_moves.push(move);

        }
    }

    // ee = time.time()

    // prNumber(e -s)
    // prNumber(ee-ss)

    // console.log(legal_moves);

    return legal_moves;
}



function get_all_natural_moves(Board, loc=null){
    
    // loc(String) : nullなら全ての移動、指定されればその位置の駒の移動だけ
    
    if (loc == null){

        let is_sente = Board.is_sente;


        // 全ての味方の駒の、全ての移動可能な場所を洗い出す

        let natural_moves_move = [];

        let loc_piece_dict = Board.all_pieces["main"];

        for (key of Object.keys(loc_piece_dict)){
            let piece = loc_piece_dict[key];
            if (piece != null){
                if (piece.is_sente == is_sente){
                    natural_moves_move = natural_moves_move.concat(get_natural_moves_move(piece, Board));
                }
            }
        }


        // 手駒

        let natural_moves_put = [];

        if (is_sente){
            var pieces_in_hand = Board.all_pieces["hand"]["sente"];
        }
        else{
            var pieces_in_hand = Board.all_pieces["hand"]["gote"];
        }


        for (piece_name of Object.keys(pieces_in_hand)){
            if (pieces_in_hand[piece_name] > 0){
                let piece = new Piece(piece_name, is_sente);
                let natural_moves_put_this_piece = get_natural_moves_put(piece, Board);
                natural_moves_put = natural_moves_put.concat(natural_moves_put_this_piece);
            }
        }
        
        // 移動と打ち手を合わせる
        var all_natural_moves = natural_moves_move.concat(natural_moves_put);

    }


    else{
        // 引数の駒が手駒かどうか（locで確認）確認して
        pass;
    }

    return all_natural_moves;
}

        
    

function can_move_to(Board, dest, is_sente){
    
    // ・そこに味方の駒がないか
    // ・１〜９の間の位置か
    // をチェック

    // dest(String) { 移動先のloc

    // return(bool) { そこへ動けるかどうか

    // >>> can_move_to(board, "55", True)


    if ((dest.length != 2) && (dest.length != 3)){
        window.alert("kora");
        exit;
    }

    if ((dest.length == 3) && (dest[dest.length-1] != "+")){
        return false;
    }

    var dest = dest.slice(0, 2);

    // 盤上に収まっていなかったら
    if ((Number(dest[0]) > 9) || (Number(dest[0]) < 1) || (Number(dest[1]) > 9) || (Number(dest[1]) < 1)){
        return false;
    }

    let piece = Board.all_pieces["main"][dest];


    // 移動先に味方の駒があったら
    if ((piece != null) && (piece.is_sente == is_sente)){
        return false;
    }
    // 移動先に敵の駒があったら
    else if ((piece != null) && (piece.is_sente != is_sente)){
        return 1;
    }
    else{
        return true;
    }
}
        
    

function get_natural_moves_move(Piece, Board){
    
    // 移動可能な場所を示す（王手による影響は考えない）
    
    
    var loc = Piece.loc;
    var col_num = Number(loc[0]);
    var row_num = Number(loc[1]);
    var is_sente = Piece.is_sente;

    if (is_sente != Board.is_sente){
        window.alert("hoge");
    }

    var potential_dests = [];  // この駒が本来動ける方向


    if (Piece.name == "FU"){

        if (is_sente){
            var dest = loc[0] + String(Number(loc[1]) - 1);
        }
        else{
            var dest = loc[0] + String(Number(loc[1]) + 1);
        }
        
        var potential_dests = [dest];
    }


    else if (Piece.name == "KY"){

        if (is_sente){
            
            let row_num_here = row_num - 1;
            while (row_num_here >= 1){
                let dest = loc[0] + String(row_num_here);
                if (can_move_to(Board, dest, is_sente) === true){
                    potential_dests.push(dest);
                    row_num_here -= 1;
                }
                else if (can_move_to(Board, dest, is_sente) === 1){
                    potential_dests.push(dest);
                    break;
                }
                else{
                    break;
                }
            }
        }
                
        else {
            for (row_num_here = row_num+1; row_num_here<10; row_num_here++){
                let dest = loc[0] + String(row_num_here);
                if (can_move_to(Board, dest, is_sente) === true){
                    potential_dests.push(dest);
                }
                else if (can_move_to(Board, dest, is_sente) === 1){
                    potential_dests.push(dest);
                    break;
                }
                else{
                    break;
                }
            }
        }
    }

    else if (Piece.name == "KE"){
        
        if (is_sente){
            var potential_dests = [String(col_num-1) + String(row_num-2), String(col_num+1) + String(row_num-2)];
        }
        else{
            var potential_dests = [String(col_num-1) + String(row_num+2), String(col_num+1) + String(row_num+2)];
        }
    }

    else if (Piece.name == "GI"){
        
        if (is_sente){
            var potential_dests = [
                String(col_num - 1) + String(row_num - 1),
                String(col_num) + String(row_num - 1),
                String(col_num + 1) + String(row_num - 1),
                String(col_num - 1) + String(row_num + 1),
                String(col_num + 1) + String(row_num + 1)
            ];
        }

        else{
            var potential_dests = [
                String(col_num - 1) + String(row_num + 1),
                String(col_num) + String(row_num + 1),
                String(col_num + 1) + String(row_num + 1),
                String(col_num - 1) + String(row_num - 1),
                String(col_num + 1) + String(row_num - 1)
            ];
        }
    }

    else if ((Piece.name == "KI") || (Piece.name == "TO") || (Piece.name == "NY") || (Piece.name == "NK") || (Piece.name == "NG")){
        
        if (is_sente){
            potential_dests = [
                String(col_num - 1) + String(row_num - 1),
                String(col_num) + String(row_num - 1),
                String(col_num + 1) + String(row_num - 1),
                String(col_num - 1) + String(row_num),
                String(col_num + 1) + String(row_num),
                String(col_num) + String(row_num + 1),
            ];
        }

        else{
            potential_dests = [
                String(col_num - 1) + String(row_num + 1),
                String(col_num) + String(row_num + 1),
                String(col_num + 1) + String(row_num + 1),
                String(col_num - 1) + String(row_num),
                String(col_num + 1) + String(row_num),
                String(col_num) + String(row_num - 1)
            ];
        }
    }

    else if (Piece.name == "OU"){
        
        for (let i=-1; i<2; i++){
            for (let j=-1; j<2; j++){
                if ((i == 0) && (j == 0)){
                    continue;
                }
                else{
                    potential_dests.push(String(col_num + i) + String(row_num + j));
                }
            }
        }
    }

    
    else if ((Piece.name == "KA") || (Piece.name == "UM")){
                    
        // 左下
        var c = col_num + 1;
        var r = row_num + 1;
        while ((c < 10) && (r < 10)){
            let dest = String(c) + String(r);
            if (can_move_to(Board, dest, is_sente) === true){
                potential_dests.push(dest);
                c += 1;
                r += 1;
            }
            else if (can_move_to(Board, dest, is_sente) === 1){
                potential_dests.push(dest);
                break;
            }
            else{
                break;
            }
        }

        // 左上
        var c = col_num + 1;
        var r = row_num - 1;
        while ((c < 10) && (r > 0)){
            let dest = String(c) + String(r);
            if (can_move_to(Board, dest, is_sente) === true){
                potential_dests.push(dest);
                c += 1;
                r -= 1;
            }
            else if (can_move_to(Board, dest, is_sente) === 1){
                potential_dests.push(dest);
                break;
            }
            else{
                break;
            }
        }

        // 右下
        var c = col_num - 1;
        var r = row_num + 1;
        while ((c > 0) && (r < 10)){
            let dest = String(c) + String(r);
            if (can_move_to(Board, dest, is_sente) === true){
                potential_dests.push(dest);
                c -= 1;
                r += 1;
            }
            else if (can_move_to(Board, dest, is_sente) === 1){
                potential_dests.push(dest);
                break;
            }
            else{
                break;
            }
        }

        // 右上
        var c = col_num - 1;
        var r = row_num - 1;
        while ((c > 0) && (r > 0)){
            let dest = String(c) + String(r);
            if (can_move_to(Board, dest, is_sente) === true){
                potential_dests.push(dest);
                c -= 1;
                r -= 1;
            }
            else if (can_move_to(Board, dest, is_sente) === 1){
                potential_dests.push(dest);
                break;
            }
            else{
                break;
            }
        }

        // 横
        if (Piece.name == "UM"){
            potential_dests = potential_dests.concat([
                String(col_num+1) + String(row_num),  // 左
                String(col_num) + String(row_num-1),  // 上
                String(col_num) + String(row_num+1),  // 下
                String(col_num-1) + String(row_num),  // 右
                ]);
        }
    }
    

    else if ((Piece.name == "HI") || (Piece.name == "RY")){
        
        // 左
        var c = col_num + 1;
        while (c < 10){
            let dest = String(c) + String(row_num);
            if (can_move_to(Board, dest, is_sente) === true){
                potential_dests.push(dest);
                c += 1;
            }
            else if (can_move_to(Board, dest, is_sente) === 1){
                potential_dests.push(dest);
                break;
            }
            else{
                break;
            }
        }

        // 右
        var c = col_num - 1;
        while (c > 0){
            let dest = String(c) + String(row_num);
            if (can_move_to(Board, dest, is_sente) === true){
                potential_dests.push(dest);
                c -= 1;
            }
            else if (can_move_to(Board, dest, is_sente) === 1){
                potential_dests.push(dest);
                break;
            }
            else{
                break;
            }
        }

        // 上
        var r = row_num - 1;
        while (r > 0){
            let dest = String(col_num) + String(r);
            if (can_move_to(Board, dest, is_sente) === true){
                potential_dests.push(dest);
                r -= 1;
            }
            else if (can_move_to(Board, dest, is_sente) === 1){
                potential_dests.push(dest);
                break;
            }
            else{
                break;
            }
        }
        
        // 下
        var r = row_num + 1;
        while (r < 10){
            let dest = String(col_num) + String(r);
            if (can_move_to(Board, dest, is_sente) === true){
                potential_dests.push(dest);
                r += 1;
            }
            else if (can_move_to(Board, dest, is_sente) === 1){
                potential_dests.push(dest);
                break;
            }
            else{
                break;
            }
        }

        // 斜め横
        if (Piece.name == "RY"){
            potential_dests = potential_dests.concat([
                String(col_num+1) + String(row_num+1),  // 左下
                String(col_num+1) + String(row_num-1),  // 左上
                String(col_num-1) + String(row_num+1),  // 右下
                String(col_num-1) + String(row_num-1),  // 右上
                ]);
        }
    }



    let natural_moves = [];
    for (var dest of potential_dests){
        if (can_move_to(Board, dest, is_sente)){

            // 歩か香は、最終段以外なら成らずに進める
            if ((Piece.name == "FU") || (Piece.name == "KY")){
                if (dest[1] != "9"){
                    natural_moves.push(loc + dest);
                }
            }
            // 桂馬
            else if (Piece.name == "KE"){
                if ((dest[1] != "8") && (dest[1] != "9")){
                    natural_moves.push(loc + dest);
                }
            }
            // それ以外
            else{
                natural_moves.push(loc + dest);
            }

            // 成ることができれば加える
            if (is_land_of_enemy(dest, is_sente)){
                // 王以外の成っていない駒は成ることができる
                if (PieceName_Hand.indexOf(Piece.name) >= 0){
                    natural_moves.push(loc + dest + "+");
                }
            }
        }
    }
                

    return natural_moves
}


function is_land_of_enemy(loc, is_sente){

    // 指し手にとって、その場所が敵陣かどうかを返す

    // loc(String) { 対象の場所
    // is_sente(bool) { 対象の指し手

    // return(bool)
    

    if (loc.length != 2){
        window.alert("hoge");
        exit;
    }
    
    let row_num = Number(loc[1]);
    if ((row_num <= 0) || (row_num >= 10)){
        window.alert("kora");
        exit;
    }

    // 後手の場合
    if ((row_num >= 7) && (!is_sente)){
        return true;
    }

    // 先手の場合
    else if ((row_num <= 3) && is_sente){
        return true;
    }

    else{
        return false;
    }
}



function get_natural_moves_put(Piece, Board){

    // Piece(Piece) { 持ち駒
    
    let is_sente = Piece.is_sente;
    let piece_name = Piece.name;
    if (is_sente != Board.is_sente){
        window.alert("hoge");
        exit;
    }

    let potential_moves_put = [];

    // 駒が置かれていない場所を全て列挙

    for (let loc of Object.keys(Board.all_pieces["main"])){
        let piece = Board.all_pieces["main"][loc];
        if (piece == null){
            potential_moves_put.push(loc);
        }
    }


    let natural_moves_put = [];
            
    if (piece_name == "FU"){
        
        for (loc of potential_moves_put){
            
            // 最終段かどうか確認
            if ((is_sente && (loc[1] == "1")) || ((!is_sente) && (loc[1] == "9"))){
                continue;
            }

            // ２歩を確認
            else{
                let is_nifu = false;
                
                let col = loc[0];
                for (let row_num=1; row_num<10; row_num++){
                    let the_piece = Board.all_pieces["main"][col + String(row_num)];
                    if (the_piece != null){
                        if ((the_piece.name == "FU") && (the_piece.is_sente == is_sente)){
                            is_nifu = true;
                            break;
                        }
                    }
                }
                
                if (!is_nifu){
                    natural_moves_put.push(loc);
                }
            }
        }
    }


    else if (piece_name == "KY"){
        
        for (loc of potential_moves_put){
            
            // 最終段かどうか確認
            if ((is_sente && (loc[1] == "1")) || ((!is_sente) && (loc[1] == "9"))){
                continue;
            }
            else{
                natural_moves_put.push(loc);
            }
        }
    }


    else if (piece_name == "KE"){
        
        for (loc of potential_moves_put){
            
            // 最終段かどうか確認
            if ((is_sente && ((loc[1] == "1") || (loc[1] == "2"))) || ((!is_sente) && ((loc[1] == "8") || (loc[1] == "9")))){
                continue;
            }
            else{
                natural_moves_put.push(loc);
            }
        }
    }

    else{
        natural_moves_put = potential_moves_put;
    }

    let natural_moves_put_result = [];
    for (loc of natural_moves_put){
        natural_moves_put_result.push(piece_name + loc);
    }

    return natural_moves_put_result
}
