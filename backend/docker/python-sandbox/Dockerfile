FROM python:3.10-slim

# Configurar un usuario no privilegiado
RUN useradd -m -s /bin/bash sandbox

# Crear directorio de trabajo
WORKDIR /sandbox

# Copiar el script de ejecución
COPY execute.py .
RUN chown sandbox:sandbox execute.py

# Cambiar al usuario no privilegiado
USER sandbox

# Establecer límites de recursos
ENV PYTHONMEMORY=128m

# Comando por defecto
ENTRYPOINT ["python", "execute.py"]
