#!/usr/bin/env python3
# execute.py - Script para ejecutar código Python de forma segura

import sys
import ast
import json
import traceback
import logging
from io import StringIO
from contextlib import redirect_stdout, redirect_stderr

# Configurar logging para depuración
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stderr
)
log = logging.getLogger("execute")

# Lista de módulos peligrosos que no deberían permitirse
FORBIDDEN_MODULES = [
    'os', 'subprocess', 'sys', 'socket', 'shutil', 'pathlib',
    'multiprocessing', 'threading', 'requests', 'urllib',
    'ftplib', 'telnetlib', 'smtplib'
]

def check_dangerous_imports(code_string):
    """Analiza el código para detectar imports potencialmente peligrosos"""
    try:
        tree = ast.parse(code_string)
        
        for node in ast.walk(tree):
            # Verificar import statements (import os, import subprocess, etc)
            if isinstance(node, ast.Import):
                for name in node.names:
                    if name.name in FORBIDDEN_MODULES or any(name.name.startswith(f"{mod}.") for mod in FORBIDDEN_MODULES):
                        return f"Import no permitido: {name.name}"
            
            # Verificar from ... import statements (from os import system, etc)
            elif isinstance(node, ast.ImportFrom):
                if node.module in FORBIDDEN_MODULES or any(node.module.startswith(f"{mod}.") for mod in FORBIDDEN_MODULES):
                    return f"Import no permitido: {node.module}"
                    
        return None
    except SyntaxError as e:
        return f"Error de sintaxis: {str(e)}"
    except Exception as e:
        return f"Error durante la validación del código: {str(e)}"

def execute_code(code_string):
    """Ejecuta el código y captura la salida estándar y errores"""
    # Verificar si el código está vacío
    if not code_string or code_string.isspace():
        return {
            'success': False,
            'output': '',
            'error': 'No se ha proporcionado código para ejecutar'
        }
    
    # Verificar el código primero
    dangerous_import = check_dangerous_imports(code_string)
    if dangerous_import:
        return {
            'success': False,
            'output': '',
            'error': dangerous_import
        }

    # Capturar stdout y stderr
    stdout_capture = StringIO()
    stderr_capture = StringIO()

    try:
        # Compilar primero para detectar errores de sintaxis
        compiled_code = compile(code_string, "<string>", "exec")

        # Preparar un entorno de ejecución limpio
        execution_globals = {'__builtins__': __builtins__}
        execution_locals = {}

        # Ejecutar el código capturando stdout y stderr
        with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
            exec(compiled_code, execution_globals, execution_locals)

        # Obtener la salida
        output = stdout_capture.getvalue()
        error = stderr_capture.getvalue()
        
        # Asegurarnos de que la salida no esté vacía si el código se ejecutó correctamente
        if not output and not error:
            # Verificar si hay algún resultado de evaluación útil
            for var_name, value in execution_locals.items():
                # Ignorar variables privadas que comienzan con _
                if not var_name.startswith('_'):
                    output += f"{var_name} = {value}\n"

        return {
            'success': True,
            'output': output,
            'error': error
        }
    except Exception as e:
        error_traceback = traceback.format_exc()
        return {
            'success': False,
            'output': '',
            'error': str(e) if not error_traceback else error_traceback
        }

def main():
    try:
        # Leer el código desde stdin
        code_string = sys.stdin.read()
        
        # Depurar la entrada
        log.debug(f"RECIBIDO STDIN RAW (hex): {code_string.encode().hex()}")
        
        if not code_string or code_string.isspace():
            # Imprimir una respuesta de error específica
            error_result = {
                'success': False,
                'output': '',
                'error': "No se ha proporcionado código para ejecutar (entrada vacía)"
            }
            print(json.dumps(error_result))
            return
            
        # Intentar procesar como JSON si viene en ese formato
        try:
            # Debug de la entrada completa recibida
            log.debug(f"Entrada recibida (primeros 100 caracteres): {code_string[:100]}")
            
            # Limpiar la entrada de posibles espacios adicionales
            code_string = code_string.strip()
            
            # Verificar si la entrada parece ser JSON
            if code_string.startswith('{') and code_string.endswith('}'):
                # Intentar parsear el JSON
                try:
                    json_input = json.loads(code_string)
                    log.debug(f"JSON parseado: {json_input}")
                    
                    if 'code' in json_input:
                        # Extraer el campo 'code'
                        code_string = json_input['code']
                        log.debug(f"Código extraído del JSON: {code_string}")
                        
                        # Verificar si el código está vacío después de extraerlo
                        if not code_string or code_string.isspace():
                            log.error("El código extraído del JSON está vacío")
                except json.JSONDecodeError as e:
                    log.debug(f"Error al parsear JSON: {e}")
                    # No es JSON válido, continuar con el string tal cual
                    log.debug(f"Usando la entrada tal cual")
            else:
                log.debug(f"La entrada no parece ser JSON, usándola tal cual")
        except Exception as e:
            # Si hay cualquier error, simplemente usar el string tal cual
            log.debug(f"Error al procesar la entrada: {e}")
            pass
            
        # Ejecutar el código
        result = execute_code(code_string)
        
        # Imprimir el resultado como JSON
        print(json.dumps(result))
    except Exception as e:
        # Si hay algún error no controlado, devolver un mensaje de error
        error_result = {
            'success': False,
            'output': '',
            'error': f"Error interno: {str(e)}"
        }
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()