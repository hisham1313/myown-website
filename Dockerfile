FROM python:3.11-slim
WORKDIR /app
# Copy requirements and install dependencies
COPY Backend/requirements.txt .
RUN pip install --default-timeout=100 --no-cache-dir -r requirements.txt
# Copy backend code contents directly to /app
COPY Backend/app/ .
# Expose port
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]