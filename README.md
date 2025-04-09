# Bucket-Counter Application

## Getting Started

To start the application with Docker:

docker-compose up -d

## Frigate Configuration

- **Access**: Frigate is accessible at http://localhost:5000
- **Initial Setup**:
  - Set admin password on first login
  - After changing configuration, restart the Docker container and close the port
  - **IMPORTANT**: Port 5000 should NOT be exposed in production environments

### Detection Configuration

Modify the configuration to detect specific objects/people:

review:

# Change here for detection

detections:
required_zones: - walking_zone
labels: - person

### Camera Setup

When configuring your camera, note that this container's network is named 'frigate-net'. You will need to:

- Change review settings
- Set appropriate model
- Configure camera parameters

## Web Application

- **Setup**: Create .env file at the root of folder web and place the correct URL.
- **Access**: The Bucket-Counter web app is available at http://localhost:3000
- **Usage**:
  1. Click "Connect" button
  2. Click "Start Logging" to begin the application
  3. Check the status bar - it should display "Connected" when successfully connected to the Mosquitto MQTT broker

## Database Administration

- **Access**: Prisma SQLite database administration interface is available at http://localhost:5000

## Cam stream

### Test video camera

ffmpeg -f avfoundation -framerate 30 -i "0" -c:v libx264 -preset veryfast -tune zerolatency -f rtsp rtsp://localhost:8554/mystream
ffmpeg -re -stream_loop -1 -i ~/path/to/video.mp4 -c:v libx264 -preset veryfast -tune zerolatency -f rtsp rtsp://localhost:8554/mystream
