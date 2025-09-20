# Use Python base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app files
COPY . .

# Run the app with Gunicorn
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app

