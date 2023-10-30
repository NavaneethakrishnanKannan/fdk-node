# Project Title
Customer Support Application

## About The App
The Order Tracking and Returns Management App is designed to empower support staff by providing them with a comprehensive tool to efficiently track customer orders and initiate returns.

# Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|CORS           | Cors accepted values            | "*"      |
|PORT           |Need to specify the Port            |       |
|DBURL           | Database connection string            |       |
|TWILIO_ACCOUNT_SID           | Twillio Account SID             |       |
|TWILIO_PHONE           | Provided by Twillio            |       |


# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version > 18
- Install MongoDB

# Getting started
- Clone the repository
```
git clone  https://github.com/NavaneethakrishnanKannan/fdk-node
```
- Install dependencies
```
cd fdk-node
npm install
```
- Run the project
```
node server.js
```