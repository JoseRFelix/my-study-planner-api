FROM node:10.16.2
ENV TZ=America/La_Paz
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/my-study-planner-api

COPY ./ ./

RUN npm install
RUN npm audit fix

CMD ["/bin/bash"]   