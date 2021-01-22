git pull
docker build -t dustin/beta-bot .
docker rm --force Beta-Bot
docker run -d --restart always --cap-add=SYS_ADMIN --name Beta-Bot -p 7869:7869 dustin/Beta-Bot