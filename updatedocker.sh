docker build -t dustin/beta-bot . 
docker rm --force beta-bot
docker run -d --restart always --cap-add=SYS_ADMIN --name beta-bot -p 7869:7869 dustin/beta-bot
