#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os, sys, copy

from .move import get_legal_moves
from .util import *
from .piece import Piece
                


class Board:

    def __init__(self, all_pieces=None):

        if all_pieces is None:

            loc_piece_dict = generate_initial_loc_piece_dict()
            pieces_in_hand = {piece_name : 0 for piece_name in PieceName_Hand}

            self.all_pieces = {
                "main" : loc_piece_dict,
                "hand" : {"sente" : copy.deepcopy(pieces_in_hand), "gote" : copy.deepcopy(pieces_in_hand)}
                }

        else:
            self.all_pieces = all_pieces

        self.is_sente = True  # 手番
        self.board_history = []  # 盤面の状態を毎回保存

        self.legal_moves = get_legal_moves(copy.deepcopy(self))  # 可能な指し手をだす
        self.board_history.append(copy.deepcopy(self))  # historyに追加

    def __str__(self):
        
        return self.kif_str()

    def kif_str(self):

        kif_str = ""

        for row_num in range(1, 10):
            for col_num in range(1, 10)[::-1]:
                
                loc_str = str(col_num) + str(row_num)
                piece = self.all_pieces["main"][loc_str]

                if piece is None:
                    the_str = "n一"

                else:
                    piece_name = piece.name
                    is_sente = piece.is_sente
                    piece_name_kanji = PieceName_normal2kanji[piece_name]
                    if is_sente:
                        the_str = "a{}".format(piece_name_kanji)
                    else:
                        the_str = "v{}".format(piece_name_kanji)

                kif_str += the_str
            
            if row_num != 9:
                kif_str += "\n"

        return kif_str

    def move(self, move):
        
        '''
        '''

        print("~"*20)
        print(self.all_pieces["main"]["99"].loc)
        
        assert (len(move) == 4) or (len(move) == 5)

        loc_from = move[:2]
        loc_to = move[2:4]

        # その手が可能かチェック
        assert move in self.legal_moves

        # 手駒を打つ
        if loc_from in PieceName_Hand:
            
            piece_name = loc_from
            
            # 手駒から減らす
            if self.is_sente:
                self.all_pieces["hand"]["sente"][piece_name] -= 1
            else:
                self.all_pieces["hand"]["gote"][piece_name] -= 1

            # 駒オブジェクトを生成して盤上に配置
            the_piece = Piece(name=piece_name, is_sente=self.is_sente)
            self.all_pieces["main"][loc_to] = the_piece


        # 駒を移動させる
        else:
            
            piece = self.all_pieces["main"][loc_from]
            piece.loc = loc_to  # 位置を移動

            # 成る時
            if move[-1] == "+":
                piece.name = PieceName_before2after[piece.name]

            # 駒をとる時
            piece_there = self.all_pieces["main"][loc_to]
            if piece_there is not None:
                assert piece_there.is_sente != self.is_sente
                # もし成り駒を取るときは名前を元に戻す
                if piece_there.name in PieceName_Nari:
                    piece_there.name = PieceName_after2before[piece_there.name]
                # 持ち駒に加える
                if self.is_sente:
                    self.all_pieces["hand"]["sente"][piece_there.name] += 1
                else:
                    self.all_pieces["hand"]["gote"][piece_there.name] += 1

            # 位置を移動
            self.all_pieces["main"][loc_from] = None
            self.all_pieces["main"][loc_to] = copy.deepcopy(piece)

        print("%"*20)
        print(self.all_pieces["main"]["99"].loc)

        # 手番を交代
        self.is_sente = not self.is_sente
        # legal_movesを出しておく
        self.legal_moves = get_legal_moves(copy.deepcopy(self))

        print("e"*20)
        print(self.all_pieces["main"]["99"].loc)

        # historyに追加
        # self.board_history.append(copy.deepcopy(self))

    
    def get_past(self, num):
        
        '''
        num手目の盤面を返す
        '''
        
        return self.board_history[num]
    
