#!/user/bin/env python 
# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, jsonify
app = Flask(__name__, static_folder="static") #インスタンス生成
app.config['JSON_AS_ASCII'] = False  # 文字化け防ぐ


import os, sys, glob2, subprocess, shutil, copy, pickle
from decimal import Decimal, ROUND_HALF_UP
import numpy as np
import pandas as pd
from pandas import DataFrame, Series
import re
import json

# import shogi
# from util import get_piece_from_board, get_pieces_in_hand, locs_normal, loc_usi2normal, loc_normal2usi, PieceNames_normal_NotNari, PieceName_normal2kanji

# from history_to_images import history_to_images
# from images_to_movie import images_to_movie


PICKLE_DIR = "./data/pickles/"



def decode_to_dict(request):
    receive = request.form
    temp = list(receive.keys())
    json_str = temp[0]
    result_dict = json.loads(json_str, encoding="utf-8")
    return result_dict




#######################################################


@app.route("/")
def board_view():

    return render_template("gui.html")



# HistoryをJSから受け取り、それを元に画像を生成する
# @app.route("/make_images_from_history", methods=["POST"])
# def make_images_from_history():

#     print("="*10)
#     history = decode_to_dict(request)

#     # なぜかmoveの「＋」が抜けてしまうので、対策
#     for i in range(len(history)):
#         one_action = history[i]
#         if "move" in one_action.keys():
#             if len(one_action["move"]) == 5:
#                 history[i]["move"] = history[i]["move"][:4] + "+"
                
#     save_dir = "./testing/"
#     if os.path.exists(save_dir):
#         shutil.rmtree(save_dir)
#     os.makedirs(save_dir)

#     global BOARD_HISTORY
#     history_to_images(history, BOARD_HISTORY, save_dir)
#     images_to_movie(save_dir)

#     return "hoge"



@app.route("/to_save_window")
def to_save_window():
    return render_template("save_window.html")

@app.route("/to_load_window")
def to_load_window():
    return render_template("load_window.html")

@app.route("/get_pickles")
def get_pickles():
    print("="*20)
    files = glob2.glob(os.path.join(PICKLE_DIR, "*.pickle"))
    files_base_name = [os.path.basename(f) for f in files]
    print(files_base_name)
    if len(files_base_name) > 0:
        files_str = ",".join(files_base_name)
    else:
        files_str = ""
    return files_str



# {"history" : [{}, {}, ...]}という形式でやり取り


# HistoryをJSから受け取り、保存
@app.route("/save/<without_ext>", methods=["POST"])
def save_history(without_ext):

    print("="*10)
    history = decode_to_dict(request)["history"]

    # なぜかmoveの「＋」が抜けてしまうので、対策

    def modify_one_action(action):
        if "move" in action.keys():
            if len(action["move"]) == 5:
                action["move"] = action["move"][:4] + "+"
        return action

    def modify(history):
        for i, action in enumerate(history):
            if "scenarios" not in action.keys():
                history[i] = modify_one_action(action)
            else:
                # ブランチだったら
                for i, sc in enumerate(action["scenarios"]):
                    action["scenarios"][i] = modify(sc)
                    history[i] = action
        return history


    history = modify(history)

    result = {"history" : history}
    fname = os.path.join(PICKLE_DIR, without_ext + ".pickle")
    with open(fname, mode="wb") as f:
        pickle.dump(result, f)

    return "hoge"


# pickleからhistoryを読み込み
@app.route("/load/<without_ext>")
def load_history(without_ext):
    
    fname = os.path.join(PICKLE_DIR, without_ext + ".pickle")
    with open(fname, mode="rb") as f:
        result = pickle.load(f)
    history = result["history"]

    return jsonify(history)


    
    
if __name__ == "__main__":
    
    app.run(host="localhost", port=8090, debug=True)
