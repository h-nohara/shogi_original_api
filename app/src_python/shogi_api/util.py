#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os, sys, copy
from .piece import Piece

PieceName_all = ["OU", "HI", "KA", "KI", "GI", "KE", "KY", "FU", "RY", "UM", "NG", "NK", "NY", "TO"]
PieceName_notNari = ["OU", "HI", "KA", "KI", "GI", "KE", "KY", "FU", ]
PieceName_Nari = ["RY", "UM", "NG", "NK", "NY", "TO"]
PieceName_Hand = ["HI", "KA", "KI", "GI", "KE", "KY", "FU"]


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
}

PieceName_before2after = {
    "HI" : "RY",
    "KA" : "UM",
    "GI" : "NG",
    "KE" : "NK",
    "KY" : "NY",
    "FU" : "TO",
}

PieceName_after2before = {
    "RY" : "HI",
    "UM" : "KA",
    "NG" : "GI",
    "NK" : "KE",
    "NY" : "KY",
    "TO" : "FU"
}

number2kanji = {
    1 : "一", 2: "二", 3 : "三", 4 : "四", 5 : "五", 6 : "六", 7 : "七", 8 : "八", 9 : "九"
}


# 初期盤面（メイン）を生成

def generate_initial_loc_piece_dict():
    
    loc_piece_dict = {}

    for row_num in range(1, 10):
        for col_num in range(1, 10):
            
            loc_str = str(col_num) + str(row_num)

            if row_num > 5:
                is_sente = True
            else:
                is_sente = False

            if (loc_str == "51") or (loc_str == "59"):
                loc_piece_dict[loc_str] = Piece("OU", is_sente)

            elif (loc_str == "41") or (loc_str == "61") or (loc_str == "49") or (loc_str == "69"):
                loc_piece_dict[loc_str] = Piece("KI", is_sente)

            elif (loc_str == "31") or (loc_str == "71") or (loc_str == "39") or (loc_str == "79"):
                loc_piece_dict[loc_str] = Piece("GI", is_sente)

            elif (loc_str == "21") or (loc_str == "81") or (loc_str == "29") or (loc_str == "89"):
                loc_piece_dict[loc_str] = Piece("KE", is_sente)

            elif (loc_str == "11") or (loc_str == "91") or (loc_str == "19") or (loc_str == "99"):
                loc_piece_dict[loc_str] = Piece("KY", is_sente)

            elif (loc_str == "82") or (loc_str == "28"):
                loc_piece_dict[loc_str] = Piece("HI", is_sente)

            elif (loc_str == "22") or (loc_str == "88"):
                loc_piece_dict[loc_str] = Piece("KA", is_sente)

            elif (row_num == 3) or (row_num == 7):
                loc_piece_dict[loc_str] = Piece("FU", is_sente)

            else:
                loc_piece_dict[loc_str] = None

    for loc in loc_piece_dict.keys():
        if loc_piece_dict[loc] is not None:
            loc_piece_dict[loc].loc = loc

    return loc_piece_dict