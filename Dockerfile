FROM node:11.15.0

WORKDIR /usr/src/my-study-planner-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]