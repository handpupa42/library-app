from RestrictedPython import safe_globals, PrintCollector
from RestrictedPython.Guards import safe_builtins, guarded_unpack_sequence, guarded_iter_unpack_sequence
from RestrictedPython.Utilities import utility_builtins
from inplace import protectedInplacevar
from fs import openFile
from safeImport import createSafeImport

def _metaclass(name, bases, dict):
    ob = type(name, bases, dict)
    ob.__allow_access_to_unprotected_subobjects__ = 1
    ob._guarded_writes = 1

    return ob

def defaultGuardedGetiter(ob):
    return ob

def defaultGuardedGetitem(ob, index):
    return ob[index]

def _write_guard(ob):
    return ob

safeGlobals = safe_globals.copy()

safeBuiltins = safe_builtins.copy()
safeBuiltins.update(utility_builtins)

safeBuiltins['open'] = openFile
safeBuiltins['list'] = list
safeBuiltins['dir'] = dir
safeBuiltins['object'] = object
safeBuiltins['reversed'] = reversed
safeBuiltins['bin'] = bin
safeBuiltins['all'] = all
safeBuiltins['any'] = any
safeBuiltins['ascii'] = ascii
safeBuiltins['bool'] = bool
safeBuiltins['bytearray'] = bytearray
safeBuiltins['bytes'] = bytes
safeBuiltins['callable'] = callable
safeBuiltins['chr'] = chr
safeBuiltins['delattr'] = delattr
safeBuiltins['divmod'] = divmod
safeBuiltins['enumerate'] = enumerate
safeBuiltins['filter'] = filter
safeBuiltins['float'] = float
safeBuiltins['format'] = format
safeBuiltins['frozenset'] = frozenset
safeBuiltins['getattr'] = getattr
safeBuiltins['hasattr'] = hasattr
safeBuiltins['hash'] = hash
safeBuiltins['hex'] = hex
safeBuiltins['id'] = id
safeBuiltins['input'] = input
safeBuiltins['int'] = int
safeBuiltins['isinstance'] = isinstance
safeBuiltins['issubclass'] = issubclass
safeBuiltins['iter'] = iter
safeBuiltins['len'] = len
safeBuiltins['locals'] = locals
safeBuiltins['map'] = map
safeBuiltins['max'] = max
safeBuiltins['min'] = min
safeBuiltins['next'] = next
safeBuiltins['oct'] = oct
safeBuiltins['ord'] = ord
safeBuiltins['pow'] = pow
safeBuiltins['property'] = property
safeBuiltins['range'] = range
safeBuiltins['repr'] = repr
safeBuiltins['round'] = round
safeBuiltins['set'] = set
safeBuiltins['setattr'] = setattr
safeBuiltins['slice'] = slice
safeBuiltins['sorted'] = sorted
safeBuiltins['str'] = str
safeBuiltins['sum'] = sum
safeBuiltins['super'] = super
safeBuiltins['tuple'] = tuple
safeBuiltins['type'] = type
safeBuiltins['vars'] = vars
safeBuiltins['zip'] = zip
safeBuiltins['__metaclass__'] = _metaclass
safeBuiltins['__name__'] = "module"
safeBuiltins['iter'] = defaultGuardedGetiter
safeBuiltins['__import__'] = createSafeImport(safeGlobals, safeBuiltins)


safeGlobals['__builtins__'] = safeBuiltins
safeGlobals['_print_'] = PrintCollector
safeGlobals['_write_'] = _write_guard
safeGlobals['_getitem_'] = defaultGuardedGetitem
safeGlobals['_getiter_'] = defaultGuardedGetiter
safeGlobals['_unpack_sequence_'] = guarded_unpack_sequence
safeGlobals['_iter_unpack_sequence_'] = guarded_iter_unpack_sequence
safeGlobals['_inplacevar_'] = protectedInplacevar
