FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt
COPY . .
RUN apt-get update && apt-get install -y dos2unix \
    && dos2unix start.sh \
    && chmod +x start.sh
CMD ["sh", "-c", "python keycloak-setup.py && uvicorn main:app --host 0.0.0.0 --port 8005 --reload"]