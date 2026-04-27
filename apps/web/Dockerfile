FROM node:20-alpine AS build
WORKDIR /repo

COPY apps/web/package*.json apps/web/
COPY packages/ui packages/ui
WORKDIR /repo/apps/web
RUN npm ci

WORKDIR /repo
COPY apps/web apps/web
WORKDIR /repo/apps/web
RUN npm run build

FROM nginx:1.27-alpine
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
EXPOSE 80
