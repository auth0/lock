FROM node

CMD ["npm", "test"]

ENV HOME /home/root
RUN mkdir -p /home/root/.browserstack/

#Install Java and Download BrowserStack
RUN yes | apt-get update
RUN yes | apt-get install default-jre
RUN curl -o $HOME/.browserstack/BrowserStackTunnel.jar http://www.browserstack.com/BrowserStackTunnel.jar

#Install Grunt
RUN npm i -g grunt-cli

#Install PhantomJS
RUN curl https://gist.githubusercontent.com/jfromaniello/26899be0cad9a7e8741d/raw/install-phantom-ubuntu.sh | bash


#Add the current dir
ADD . /test-dir
WORKDIR /test-dir

RUN cp browserstack.json /home/root/.browserstack/
RUN mv browserstack.json /home/root/

RUN npm_config_unsafe_perm=true npm i
