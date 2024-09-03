FROM nginx:stable-alpine

COPY docker-entrypoint.sh /
COPY check_ssl.sh /

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 80

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]