# use node 8
FROM node:10.16.0

# add backports, so that the ffmpeg can be installed
RUN echo deb http://http.debian.net/debian stretch-backports main >> /etc/apt/sources.list.d/backports.list

# install updates and the ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg

# copy the appilication into image
WORKDIR /video-sum
ADD . /video-sum

# build the application
RUN npm install
RUN npm run build

# start it - if user does not provide additional arguments it will print help
ENTRYPOINT ["node", "dist/video-sum"]