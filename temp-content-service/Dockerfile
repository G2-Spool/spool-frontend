FROM python:3.9-slim

WORKDIR /app

# Install dependencies
RUN pip install fastapi uvicorn

# Copy the app
COPY main.py /app/

EXPOSE 8000

CMD ["python", "main.py"]