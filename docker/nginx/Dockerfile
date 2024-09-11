FROM nginx:stable-alpine

COPY check_ssl.sh /

ENTRYPOINT ["/bin/sh", "-c"]

EXPOSE 80

STOPSIGNAL SIGQUIT

CMD ["/check_ssl.sh & exec /docker-entrypoint.sh nginx -g 'daemon off;'"]