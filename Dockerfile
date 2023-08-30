FROM nginx:1.19.1-alpine

WORKDIR /data

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./build /data

VOLUME ["/data/dynamic"]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
