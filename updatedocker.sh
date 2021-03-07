docker build -t dustin/beta-bot . 
docker rm --force beta-bot
docker run -d --restart always --cap-add=SYS_ADMIN --name beta-bot --memory=1500m --cpus=0.5 -p 7869:7869 dustin/beta-bot
