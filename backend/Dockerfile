FROM python:3.9.12-slim

WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .
EXPOSE 5555
CMD [ "python3", "main.py" ]