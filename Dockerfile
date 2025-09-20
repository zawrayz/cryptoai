# Use official Python runtime
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port
EXPOSE 8080

# Start Gunicorn server
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app
