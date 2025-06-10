FROM python:3.10-alpine

WORKDIR /sandbox

COPY execute.py .

RUN chmod +x execute.py

ENV PYTHONUNBUFFERED=1 
ENV PYTHONIOENCODING=utf-8
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8


ENTRYPOINT ["python", "execute.py"]
