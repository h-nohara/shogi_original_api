#!/user/bin/env python 
# -*- coding: utf-8 -*-

import os, sys, copy
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

from .plot_board import Plot
from image_handlers.make_WordImage import make_WordImage
from image_handlers.overlaid_image import overlaid_handler


'''
recorder = ImageNameRecorder("img/")
history_to_images(history, recorder)
'''


def draw_boad(board, save_name, light_up_locs=False, mark_locs=False):
        
    '''
    盤面画像を保存する
    オプションで背景に色をつける

    light_up_locs(list(tuple)) : 背景に色をつける位置

    >>> self.draw_board(light_up_locs=[(5,5), (3,4)], mark_locs=[])
    '''
    
    board_plot = Plot(board)

    # 盤面
    board_plot.plot_board()

    # マーキング
    if light_up_locs:
        board_plot.plot_marking(locs=light_up_locs, shape="square")
    if mark_locs:
        board_plot.plot_marking(locs=mark_locs, shape="circle")
    
    # 駒
    board_plot.plot_pieces()
    board_plot.plot_komadai()
    board_plot.plot_mochigoma()

    board_plot.save_pic(save_name)  # 保存
    plt.close()


# todo : 複数の文字画像を扱えるようにする
def draw_text(message, base_image_path, word_image_path):
    
    # 最初に文字画像を生成

    font_size = 50

    make_WordImage(
        word = message["text"], 
        fontsize = font_size, 
        fontfile = "/Library/Fonts/ヒラギノ丸ゴ ProN W4.ttc", 
        num_color = 3, 
        colors = ["blue", "white", "blue"],
        stroke_ws = [9 ,3],
        result_image = word_image_path,
        W = font_size * (1 + len(message["text"])),
        H = font_size * 1.3
    )

    # 盤面画像に貼り付ける
    overlaid_handler(base_image_path, [word_image_path], base_image_path)



def action_to_image(action, save_name):
    
    board = action["board_state"]

    if "message" in action.keys():

        message = action["message"]

        light_up_locs = False
        mark_locs = False

        if "light_up_locs" in message.keys():
            if message["light_up_locs"]:
                light_up_locs = message["light_up_locs"]

        if "mark_locs" in message.keys():
            if message["mark_locs"]:
                mark_locs = message["mark_locs"]


        draw_boad(board=board, light_up_locs=light_up_locs, mark_locs=mark_locs, save_name=save_name)

        if "text" in message.keys():
            word_image_path = os.path.join(os.path.dirn(save_name), "img.png")
            draw_text(message, save_name, word_image_path)



    elif "fly_to" in action.keys():

        draw_boad(board=board, save_name=save_name)

    elif "move" in action.keys():

        move = action["move"]
        pos_after = move[2:]  # 動き先の位置
        assert (len(pos_after) == 2) or ((len(pos_after) == 3) and pos_after[-1]=="+")
        draw_boad(board=board, light_up_locs=[(int(pos_after[0]), int(pos_after[1]))], save_name=save_name)



def history_to_images(history, recorder):

    for action in history:

        if "scenarios" not in action.keys():
            save_name = recorder.next()
            action_to_image(action, save_name)

        else:

            for mini_sc in action["scenarios"]:
                save_name = recorder.next()
                action_to_image(action, save_name)  # 分岐の直前
                history_to_images(mini_sc, recorder)  # 分岐後



class ImageNameRecorder:

    def __init__(self, save_dir):

        self.save_dir = save_dir

        self.counter = 0
        self.cut_heads = []

    
    def next(self, is_cut_head=False):

        img_path = os.path.join(self.save_dir, "img_{0:03d}".format(self.counter))
        self.counter += 1
        
        if is_cut_head:
            self.cut_heads.append(img_path)

        return img_path




# def draw_all(self):
        
#     if self.parent_action is None:
#         raise ValueError("set self.parent_action")

#     # 現在の棋譜をコピーしてくる
#     self.board_copy = copy.deepcopy(self.parent_action.parent_scenario.board)

#     # 最新の盤面と背景を保存
#     if self.light_up_locs or self.mark_locs:

#         if self.light_up_locs:
#             light_up_locs = self.light_up_locs["locs"]
#         else:
#             light_up_locs = None

#         if self.mark_locs:
#             mark_locs = self.mark_locs["locs"]
#         else:
#             mark_locs = None

#         self.draw_boad(light_up_locs=light_up_locs, mark_locs=mark_locs)
#     else:
#         self.draw_boad()
    
#     # 保存した画像にテキストを加えて保存
#     if self.text:
#         self.draw_text()
