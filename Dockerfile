FROM node:11.15.0
ENV TZ=America/La_Paz
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/my-study-planner-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]   