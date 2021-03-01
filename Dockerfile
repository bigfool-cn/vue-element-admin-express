FROM alpine AS builder

RUN mkdir -p /vue-element-admin-express

WORKDIR /vue-element-admin-express

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

RUN apk add --no-cache --update nodejs nodejs-npm

COPY . .

RUN npm config set registry=https://registry.npm.taobao.org \
    && npm install node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/

RUN npm install --production \
    && npm run build:prod

RUN rm -rf `ls | egrep -v '(dist)'`

COPY ./server/package.json ./server/package-lock.json ./

RUN npm install --production


FROM alpine

# MAINTAINER
LABEL name="vue-element-admin-express"
LABEL version="1.0.1"
LABEL author="bigfool <1063944784@qq.com>"
LABEL maintainer="bigfool <1063944784@qq.com>"
LABEL description="vue-element-admin-express application"

RUN mkdir -p /vue-element-admin-express \
    && mkdir -p /vue-element-admin-express/logs

WORKDIR /vue-element-admin-express

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

RUN apk add --no-cache --update nodejs nodejs-npm

COPY --from=builder /vue-element-admin-express/node_modules ./node_modules
COPY --from=builder /vue-element-admin-express/dist ./dist
COPY ./server ./

RUN find . -type d -name '.[^.]*' -prune -exec echo rm -rf {} + \
    && rm -rf `ls | egrep -v '(dist|node_modules|model|router|utils|app.js|pm2.json|package.json|package-lock.json)'`

RUN npm config set registry=https://registry.npm.taobao.org \
    && npm install -g pm2

# 设置时区
RUN apk add -U tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/lcoaltime \
    && echo 'Asia/Shanghai' > /etc/timezone

ENV TZ=Asia/Shanghai


# 新建一个用户www 并设置项目目录用户组
RUN adduser -D -H www \
    && chown -R www /vue-element-admin-express

ENV NODE_ENV=production


EXPOSE 8002

CMD ["pm2-docker", "pm2.json"]
