#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os, sys, copy


def get_abspath(relative_path):
    abspath_this = os.path.abspath(os.path.dirname(__file__))
    abspath_target = os.path.join(abspath_this, relative_path)
    return abspath_target