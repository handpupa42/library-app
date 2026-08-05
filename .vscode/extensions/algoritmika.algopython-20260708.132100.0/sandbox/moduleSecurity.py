# Прослойки для различных модулей

from fs import validateFilePath

moduleSecurity = {}

def _methodNotAllowed():
    raise PermissionError("Method not allowed")

def _disabledMethods(dict, methods):
    for method in methods:
        dict[method] = _methodNotAllowed

_disabledMethodsOs = [
     'chdir',
     'chmod',
     'chown',
     'link',
     'symlink',
     'system',
     'popen',
     'fdopen'
]

# Запрещаем работу с файлами за пределами рабочей папки
def _moduleSecurityOs(dict):
    _disabledMethods(dict, _disabledMethodsOs)
    original = dict.copy()

    def open(path, flags, mode=0o777, dir_fd=None):
        validateFilePath(path)
        return original['open'](path, flags, mode, dir_fd)

    dict['open'] = open

    def listdir(path):
        validateFilePath(path)
        return original['listdir'](path)

    dict['listdir'] = listdir

    def mkdir(path, mode=0o777):
        validateFilePath(path)
        return original['mkdir'](path, mode)

    dict['mkdir'] = mkdir

    def makedirs(path, mode=0o777, exist_ok=False):
        validateFilePath(path)
        return original['makedirs'](path, mode, exist_ok)

    dict['makedirs'] = makedirs

    def remove(path, dir_fd=None):
        validateFilePath(path)
        return original['remove'](path, dir_fd)

    dict['remove'] = remove

    def rename(src, dst):
        validateFilePath(src)
        validateFilePath(dst)
        return original['rename'](src, dst)

    dict['rename'] = rename

    def renames(old, new):
        validateFilePath(old)
        validateFilePath(new)
        return original['renames'](old, new)

    dict['renames'] = renames

    def replace(source, destination):
        validateFilePath(source)
        validateFilePath(destination)
        return original['replace'](source, destination)

    dict['replace'] = replace

    def rmdir(path):
        validateFilePath(path)
        return original['rmdir'](path)

    dict['rmdir'] = rmdir

    def removedirs(path):
        validateFilePath(path)
        return original['removedirs'](path)

    dict['removedirs'] = removedirs

    def truncate(path, length):
        validateFilePath(path)
        return original['truncate'](path, length)

    dict['truncate'] = truncate


_disabledMethodsShutil = [
    'copystat',
    'disk_usage',
    'chown',
    'which',
]

# Запрещаем работу с файлами за пределами рабочей папки
def _moduleSecurityShutil(dict):
    _disabledMethods(dict, _disabledMethodsShutil)
    original = dict.copy()

    def copyfileobj(fsrc, fdst, length=16*1024):
        validateFilePath(fsrc)
        validateFilePath(fdst)
        return original['copyfileobj'](fsrc, fdst, length)

    dict['copyfileobj'] = copyfileobj

    def copyfile(src, dst, follow_symlinks=True):
        validateFilePath(src)
        validateFilePath(dst)
        return original['copyfile'](src, dst, follow_symlinks)

    dict['copyfile'] = copyfile

    def copy(src, dst, follow_symlinks=True):
        validateFilePath(src)
        validateFilePath(dst)
        return original['copy'](src, dst, follow_symlinks)

    dict['copy'] = copy

    def copy2(src, dst, follow_symlinks=True):
        validateFilePath(src)
        validateFilePath(dst)
        return original['copy2'](src, dst, follow_symlinks)

    dict['copy2'] = copy2

    def copytree(src, dst, symlinks=False, ignore=None, copy_function=copy2, ignore_dangling_symlinks=False):
        validateFilePath(src)
        validateFilePath(dst)
        return original['copytree'](src, dst, symlinks, ignore, copy_function, ignore_dangling_symlinks)

    dict['copytree'] = copytree

    def rmtree(path, ignore_errors=False, onerror=None):
        validateFilePath(path)
        return original['rmtree'](path, ignore_errors, onerror)

    dict['rmtree'] = rmtree

    def move(src, dst, copy_function=copy2):
        validateFilePath(src)
        validateFilePath(dst)
        return original['move'](src, dst, copy_function)

    dict['move'] = move

    def make_archive(base_name, format, root_dir=None, base_dir=None, verbose=0,
             dry_run=0, owner=None, group=None, logger=None):
        if root_dir is not None:
            validateFilePath(root_dir)
        if base_dir is not None:
            validateFilePath(base_dir)
        return original['make_archive'](base_name, format, root_dir, base_dir, verbose, dry_run, owner, group, logger)

    dict['make_archive'] = make_archive

    def unpack_archive(filename, extract_dir=None, format=None):
        if extract_dir is not None:
            validateFilePath(extract_dir)
        return original['unpack_archive'](filename, extract_dir, format)

    dict['unpack_archive'] = unpack_archive

moduleSecurity['shutil'] = _moduleSecurityShutil
moduleSecurity['os'] = _moduleSecurityOs
