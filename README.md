# NOClist Retreiver
Node.js app to retreive the NOClist from BADSEC server

## Prerequisites
- Have [Docker](https://docs.docker.com/get-docker/) installed in your system
- Installed [Node.JS](https://nodejs.org/en/download/)  and [Git](https://git-scm.com/downloads) if your going to clone this repo

## Installation
### Using Docker 
1. Open your terminal and  run this command `docker run --rm -p 8888:8888 adhocteam/noclist` 
2. Open another terminal window and run this command `docker run --network host gmainapro/noclist_retriever:latest`

- You can use the same terminal by adding `-d` to the docker run **adhocteam/noclist** command to run the container in detached mode

### Using cloned repo
1. You need to run the adhoc/noclist image using as in the command in the first step above
2. Open your terminal and enter the directory you would like clone this repo and run `git clone https://github.com/gideonmaina/NOClist_retriever.git`
3. `cd <cloned repo directory>`
4. Run `node client.js`
