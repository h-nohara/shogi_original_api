class Piece {

    constructor (name, is_sente, loc=null){

        this.name = name;
        this.is_sente = is_sente;
        this.loc = loc;

    }

}

function deepcopy_Piece(Piece){
    new_Piece = new Piece(Piece.name, Piece.is_sente, Piece.loc);
    return new_Piece;
}