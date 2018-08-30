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
IMAGE_DIR = "./data/images/"
MOVIE_DIR = "./"



def decode_to_dict(request):
    receive = request.form
    temp = list(receive.keys())
    json_str = temp[0]
    result_dict = json.loads(json_str, encoding="utf-8")
    return result_dict




#######################################################


# root
@app.route("/")
def board_view():
    return render_template("gui.html")


# save window
@app.route("/to_save_window")
def to_save_window():
    return render_template("save_window.html")

# load window
@app.route("/to_load_window")
def to_load_window():
    return render_template("load_window.html")

# get saved pickle names
@app.route("/get_pickles")
def get_pickles():
    print("="*20)
    global PICKLE_DIR
    files = glob2.glob(os.path.join(PICKLE_DIR, "*.pickle"))
    files_base_name = [os.path.basename(f) for f in files]
    print(files_base_name)
    if len(files_base_name) > 0:
        files_str = ",".join(files_base_name)
    else:
        files_str = ""
    return files_str



# {"history" : [{}, {}, ...]}という形式でやり取り


def modify_one_action(action):

    '''
    jsonでデータを受け取った時に、成りを表す"+"が空文字になってしなうのを修正
    '''

    if "move" in action.keys():
        if len(action["move"]) == 5:
            action["move"] = action["move"][:4] + "+"

    for i, move in enumerate(action["board_state"].legal_moves):
        if (len(move) == 5) and (move[-1] != "+"):
            action["board_state"].legal_moves[i] = move[:4] + "+"

    return action


def modify(history):

    modified_history = []

    for action in history:

        # ブランチだったら
        if "scenarios" in action.keys():
            for i, sc in enumerate(action["scenarios"]):
                action["scenarios"][i] = modify(sc)
                
        modified_history.append(modify_one_action(action))

    return modified_history


# save
@app.route("/save/<without_ext>", methods=["POST"])
def save_history(without_ext):

    print("="*10)
    history = decode_to_dict(request)["history"]

    # なぜかmoveの「＋」が抜けてしまうので、対策
    history = modify(history)

    result = {"history" : history}
    global PICKLE_DIR
    fname = os.path.join(PICKLE_DIR, without_ext + ".pickle")
    with open(fname, mode="wb") as f:
        pickle.dump(result, f)

    return "hoge"


# load
@app.route("/load/<without_ext>")
def load_history(without_ext):

    global PICKLE_DIR
    fname = os.path.join(PICKLE_DIR, without_ext + ".pickle")
    with open(fname, mode="rb") as f:
        result = pickle.load(f)
    history = result["history"]

    return jsonify({"history" : history})


# HistoryをJSから受け取り、それを元に画像を生成する
@app.route("/make_images_from_history", methods=["POST"])
def make_images_from_history():

    print("="*10)
    history = decode_to_dict(request)["history"]
    history = modify(history)
                
    global IMAGE_DIR
    if os.path.exists(IMAGE_DIR):
        shutil.rmtree(IMAGE_DIR)
    os.makedirs(IMAGE_DIR)

    history_to_images(history, BOARD_HISTORY, save_dir)
    images_to_movie(save_dir)

    return "hoge"



    
    
if __name__ == "__main__":
    
    app.run(host="localhost", port=8090, debug=True)
