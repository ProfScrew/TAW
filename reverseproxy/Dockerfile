FROM nginx:alpine
COPY contents/nginx.conf /etc/nginx/nginx.conf
COPY contents/certificates/nginx.key /etc/nginx/ssl/
COPY contents/certificates/nginx.crt /etc/nginx/ssl/
COPY contents/static/ /var/www/CookHub/static