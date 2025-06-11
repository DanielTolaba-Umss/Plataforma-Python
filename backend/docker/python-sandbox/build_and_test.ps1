# Script para construir y probar la nueva implementación
# ejecutar: # .\build_and_test.ps1


Write-Host "Construyendo imagen Docker simplificada..." -ForegroundColor Cyan
docker build -f Dockerfile -t python-sandbox .

$imageExists = docker image ls python-sandbox -q
if (-not $imageExists) {
    Write-Host "Error: No se pudo crear la imagen Docker" -ForegroundColor Red
    exit 1
}

Write-Host "Imagen Docker creada correctamente" -ForegroundColor Green

Write-Host "Probando la ejecución de un caso simple..." -ForegroundColor Cyan

$testJson = @"
{
    "code": "def suma_lista(numeros):\n    suma = 0\n    for num in numeros:\n        suma += num\n    return suma",
    "input": "suma_lista([1, 2, 3])",
    "expected": "6"
}
"@

$testJson | Out-File -Encoding utf8 test_input.json

Write-Host "Ejecutando contenedor con caso de prueba..." -ForegroundColor Cyan
Get-Content test_input.json | docker run -i --rm python-sandbox

Write-Host "Prueba completada. Verifica la respuesta" -ForegroundColor Green

Remove-Item test_input.json
