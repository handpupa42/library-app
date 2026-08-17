import os
from env import PROJECT_PATH

def pathIsParent(child_path):
    child_path = os.path.abspath(child_path)
    return os.path.commonpath([PROJECT_PATH]) == os.path.commonpath([PROJECT_PATH, child_path])

def validateFilePath(path):
    if pathIsParent(path) is False:
        raise PermissionError("Access denied for {path}".format(path=path))

def openFile(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None):
    validateFilePath(file)
    return open(file, mode, buffering, encoding, errors, newline, closefd, opener)

encodings = ['utf-8', 'windows-1250', 'windows-1252', 'windows-1251', 'ansi']

def loadFile(path):
    for e in encodings:
        f = open(path, 'r', encoding=e)
        try:
            return f.read()
        except:
            f.close()

    return open(path, 'r').read()
