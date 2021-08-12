
FROM alpine:latest
RUN apk add --no-cache nodejs npm 

WORKDIR /app
COPY . /app

ENTRYPOINT [ "node" ]
CMD ["client.js"] 