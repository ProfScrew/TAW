FROM node:latest AS frontend
WORKDIR /app/frontend
COPY angular/ .
RUN yarn setup-prod

FROM nginx:latest
COPY --from=frontend /app/frontend/dist/angular/ /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
