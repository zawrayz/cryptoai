# Use official lightweight Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy files
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run the web service on port 8080
CMD exec gunicorn --bind :8080 --workers 1 --threads 8 app:app
