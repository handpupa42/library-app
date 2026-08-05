from RestrictedPython import compile_restricted
from env import PROJECT_DIR, MAIN_FILE
from safeBuiltins import safeGlobals
from fs import loadFile
import os

os.chdir(PROJECT_DIR)
sourceCode = loadFile(MAIN_FILE)
byteCode = compile_restricted(
	sourceCode,
	filename='<inline code>',
	mode='exec'
)
eval(byteCode, safeGlobals, None)


