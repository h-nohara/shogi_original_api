#!/user/bin/env python 
# -*- coding: utf-8 -*-

import os, sys, copy, shutil
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

from .plot_board import Plot
from .util import get_abspath

image_handlers_PATH = get_abspath("image_handlers")
sys.path.append(image_handlers_PATH)
from make_WordImage import make_WordImage
from overlaid_image import overlaid_handler
# from image_handlers.make_WordImage import make_WordImage
# from image_handlers.overlaid_image import overlaid_handler

from .images_to_movie import images_to_movie


'''
recorder = ImageNameRecorder("img/")
history_to_images(history, recorder)
'''


def draw_boad(board, save_name, light_up_locs=False, mark_locs=False):
        
    '''
    盤面画像を保存する
    オプションで背景に色をつける

    light_up_locs(list(tuple)) : 背景に色をつける位置

    >>> self.draw_board(light_up_locs=["55", "34"], mark_locs=[])
    '''
    
    board_plot = Plot(board)

    # 盤面
    board_plot.plot_board()


    # マーキング
    if light_up_locs:
        light_up_locs = [(int(loc_str[0]), int(loc_str[1])) for loc_str in light_up_locs]  # ["11", ...] -> [(1, 1), ...]
        board_plot.plot_marking(locs=light_up_locs, shape="square")
    if mark_locs:
        mark_locs = [(int(loc_str[0]), int(loc_str[1])) for loc_str in mark_locs]  # ["11", ...] -> [(1, 1), ...]
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

        if "light_up" in message.keys():
            if message["light_up"]:
                light_up_locs = message["light_up"]

        if "mark" in message.keys():
            if message["mark"]:
                mark_locs = message["mark"]


        draw_boad(board=board, light_up_locs=light_up_locs, mark_locs=mark_locs, save_name=save_name)

        if "text" in message.keys():
            word_image_path = os.path.join(os.path.dirname(save_name), "word.png")
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

            # initiialの時
            if "move" in action.keys():
                if action["move"] == "initial":
                    draw_boad(action["board_state"], save_name)
                    continue

            action_to_image(action, save_name)

        # シナリオアクションだったら
        else:

            board_before_branch = action["board_state"]

            for mini_sc in action["scenarios"]:

                save_name = recorder.next(True)
                draw_boad(board_before_branch, save_name)  # 分岐の直前の状態を毎回画像に
                history_to_images(mini_sc, recorder)  # 分岐後を順番に画像に


def history_to_movies(history, save_dir_img, save_dir_movie):

    recorder = ImageNameRecorder(save_dir_img)
    history_to_images(history, recorder)

    print("\n"*20)

    # [0, 12, 20, 最後]　のような形式
    cut_head_numbers = [0]
    for fname in recorder.cut_heads:
        number = int(os.path.basename(fname).split(".")[0].split("_")[-1])
        cut_head_numbers.append(number)
    cut_head_numbers.append(recorder.counter)


    print("="*20)

    # print(cut_head_numbers)
    # sys.exit()

    chunk_imges_dir = os.path.join(save_dir_img, "temporary_chunks")
    if os.path.exists(chunk_imges_dir):
        shutil.rmtree(chunk_imges_dir)

    for i in range(len(cut_head_numbers) - 1):

        head = cut_head_numbers[i]
        after_tail = cut_head_numbers[i+1]

        os.makedirs(chunk_imges_dir)

        # 今回の動画用の画像を新しいフォルダにコピーする
        for j, num in enumerate(range(head, after_tail)):
            img_to_copy = os.path.join(save_dir_img, recorder.base_temp_name.format(num))
            shutil.copy(img_to_copy, os.path.join(chunk_imges_dir, "img_{0:03d}.png".format(j)))

        img_path_temp = os.path.join(chunk_imges_dir, "img_%03d.png")
        result_name = os.path.join(save_dir_movie, "movie_{0:03d}.mp4".format(i))
        images_to_movie(load_dir=chunk_imges_dir, img_path_temp=img_path_temp, result_name=result_name)

        shutil.rmtree(chunk_imges_dir)



class ImageNameRecorder:

    def __init__(self, save_dir):

        self.save_dir = save_dir
        self.base_temp_name = "img_{0:03d}.png"

        self.counter = 0
        self.cut_heads = []

    
    def next(self, is_cut_head=False):

        img_path = os.path.join(self.save_dir, self.base_temp_name.format(self.counter))
        self.counter += 1
        
        if is_cut_head:
            self.cut_heads.append(img_path)

        return img_path
