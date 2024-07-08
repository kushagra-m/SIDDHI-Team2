# FROM python:3.10.12
# ADD requirements.txt /
# RUN pip install -r /requirements.txt
# ADD finalized_model.sav /
# ADD main.py /
# ENV TF_DISABLE_TFTRT=1
# ENV PYTHONUNBUFFERED=1
# CMD [ "python", "./main.py" ]

# FROM python:3.10.12-alpine
# COPY . /app
# WORKDIR /app
# RUN pip install -r requirements.txt
# CMD python main.py

#BELOW WORKS PERFECTLY
# FROM python:3.10

# # Update pip and install necessary build tools
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     gfortran \
#     && apt-get clean

# # Upgrade pip and setuptools
# RUN pip install --upgrade pip setuptools

# # Copy application code
# COPY . /app
# WORKDIR /app

# # Install Python dependencies
# RUN pip install -r requirements.txt


# # Make port 8000 available to the world outside this container
# EXPOSE 8000

# # Define environment variable
# ENV UPLOAD_DIR=/app/uploads

# # Run uvicorn server
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

FROM python:3.10-slim

# Update and install necessary build tools
RUN apt-get update && apt-get install -y \
    build-essential \
    gfortran \
    && apt-get clean

# Upgrade pip and setuptools
RUN pip install --upgrade pip setuptools

# Copy application code
COPY . /app
WORKDIR /app

# Install Python dependencies
RUN pip install -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable
ENV UPLOAD_DIR=/app/uploads

# Run uvicorn server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]





