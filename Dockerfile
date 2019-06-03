FROM node:12.0.0

WORKDIR /app/my-study-planner.api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]