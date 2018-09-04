#!/user/bin/env python 
# -*- coding: utf-8 -*-

import subprocess, os, sys

def images_to_movie(load_dir, img_path_temp, result_name):

    '''
    img_path_temp : os.path.join(load_dir, "img_%03d.png")
    '''

    adding = '"scale=trunc(iw/2)*2:trunc(ih/2)*2"'

    concat_cmd = "ffmpeg -y -r 0.5 -i {} -vcodec libx264 -pix_fmt yuv420p -r 1 -vf {} {}".format(img_path_temp, adding, result_name)

    subprocess.call(concat_cmd, shell=True)
