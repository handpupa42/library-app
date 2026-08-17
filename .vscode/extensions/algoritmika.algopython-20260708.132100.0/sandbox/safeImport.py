from RestrictedPython import compile_restricted
from fs import loadFile
from moduleSecurity import moduleSecurity
import types
import os

FORBIDDEN_MODULES = [
    'sys',
    'implib',
    'inspect',
    'pathlib',
    'subprocess'
]

ALLOWED_MODULES = [
 'pyqt5',
 'pandas',
 'pillow',
 'lxml',
 'kivy',
 'flask',
 'replit_play',
 'beautifulsoup4',
 'pylint',
 'pygame',
 'pygame.image',
 'pygame.pkgdata',
]

def createSafeImport(safeGlobals, safeBuiltins):
    def create_module(name, path):
        module = types.ModuleType(name, path)
        code = loadFile(path)
        byte_code = compile_restricted(
            code,
            filename='<inline code>',
            mode='exec'
        )
        module.__dict__.update(safeGlobals)
        exec(byte_code, module.__dict__)
        return module

    modules = {}

    def safeImport(mname, globals=None, locals=None, fromlist=None, level=0):
        if mname == "builtins":
            if mname in modules:
                return modules[mname]

            module = types.ModuleType(mname, "safe builtins")
            module.__dict__.update(safeBuiltins)
            modules[mname] = module
            return module

        if mname in FORBIDDEN_MODULES:
            raise SyntaxError('Module forbidden: {mname}'.format(mname=mname))

        path = '{path}.py'.format(path=mname.replace('.', '/'))

        if os.path.isfile(path):
            if mname in modules:
                return modules[mname]
            module = create_module(mname, path)
            modules[mname] = module
            return module

        path = '{path}/__init__.py'.format(path=mname.replace('.', '/'))

        if os.path.isfile(path):
            if mname in modules:
                return modules[mname]
            module = create_module(mname, path)
            modules[mname] = module
            return module

        module = __import__(mname, globals, locals, fromlist, level)

        if mname not in ALLOWED_MODULES:
            module.__dict__.update(safeGlobals)

            modsec = moduleSecurity.get(mname, None)
            if modsec:
                del moduleSecurity[mname]
                modsec(module.__dict__)

        return module

    return safeImport
