# Cam stream

ffmpeg -f avfoundation -framerate 30 -i "0" -c:v libx264 -preset veryfast -tune zerolatency -f rtsp rtsp://localhost:8554/mystream
ffmpeg -re -stream_loop -1 -i ~/Desktop/day.mp4 -c:v libx264 -preset veryfast -tune zerolatency -f rtsp rtsp://localhost:8554/mystream

# RSTP Server

docker run -d--name rtsp-server --network frigate_net --rm -it -e RTSP_PROTOCOLS=tcp -p 8554:8554 -p 1935:1935 -p 8888:8888 aler9/rtsp-simple-server
