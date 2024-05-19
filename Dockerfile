FROM nginx

EXPOSE 80
EXPOSE 443

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY build/ .
