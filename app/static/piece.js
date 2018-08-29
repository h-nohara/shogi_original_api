class Piece {

    constructor (name, is_sente, loc=null){

        this.name = name;
        this.is_sente = is_sente;
        this.loc = loc;

    }

}

function deepcopy_Piece(piece){

    let new_Piece = new Piece(
        $.extend(true, [], [piece.name])[0],
        $.extend(true, [], [piece.is_sente])[0],
        $.extend(true, [], [piece.loc])[0],
    );
    
    return new_Piece;
}