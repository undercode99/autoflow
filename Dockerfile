FROM golang:1.16.3-alpine3.13
ENV TZ=Asia/Jakarta
RUN date
RUN mkdir /app
COPY . /app
WORKDIR /app
RUN go build -o main .
CMD ["/app/main"]
