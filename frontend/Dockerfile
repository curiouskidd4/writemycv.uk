FROM node:14.4.0-alpine3.10 as build
USER root
WORKDIR /frontend
COPY . /frontend
ARG API_URL
ARG STRIPE_PUBLIC_KEY
ARG ADOBE_EMBED_KEY
ARG REACT_APP_WS_URL

ENV REACT_APP_API_URL $API_URL
ENV REACT_APP_STRIPE_PUBLIC_KEY $STRIPE_PUBLIC_KEY
ENV REACT_APP_ADOBE_EMBED_KEY $ADOBE_EMBED_KEY
ENV REACT_APP_WS_URL $REACT_APP_WS_URL
ENV REACT_APP_STRIPE_PORTAL $REACT_APP_STRIPE_PORTAL

RUN npm install 
RUN npm install react-scripts -g --silent
RUN npm run build

FROM nginx:1.13.12-alpine
COPY --from=build /frontend/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]