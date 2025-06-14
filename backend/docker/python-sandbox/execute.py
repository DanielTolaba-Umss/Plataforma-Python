
import json
import sys
from io import StringIO
from contextlib import redirect_stdout, redirect_stderr

def execute_code(code, test_input=None, expected_output=None):
    
    stdout_capture = StringIO()
    stderr_capture = StringIO()
    
    exec_globals = {'__builtins__': __builtins__}
    exec_locals = {}
    
    try:
        with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
            exec(code, exec_globals, exec_locals)
        result = None
        if test_input:

            with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
                result = eval(test_input, exec_globals, exec_locals)

        output = stdout_capture.getvalue().strip()
        error = stderr_capture.getvalue().strip()
        
        success = True
        if expected_output is not None:

            expected = expected_output.strip()
            result_str = str(result).strip() if result is not None else ""
            
            if result_str == expected:
                success = True
            else:

                try:
                    result_num = float(result_str)
                    expected_num = float(expected)

                    success = abs(result_num - expected_num) < 1e-6
                except (ValueError, TypeError):

                    success = False
        
        return {
            'success': success,
            'output': result_str if result is not None else output,
            'error': error
        }
    
    except Exception as e:
        return {
            'success': False,
            'output': '',
            'error': str(e)
        }

def main():  
    try:

        input_data = json.loads(sys.stdin.read())
        
        code = input_data.get('code', '')
        test_input = input_data.get('input', None)
        expected_output = input_data.get('expected', None)
        
        result = execute_code(code, test_input, expected_output)
        
        print(json.dumps(result))
        
    except Exception as e:

        error_result = {
            'success': False,
            'output': '',
            'error': f"Error de ejecución: {str(e)}"
        }
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()
