# A fullstack Arduino temperature monitor 
[![Docker Pulls](https://img.shields.io/docker/pulls/strm/temperature-monitor-backend.svg?style=plastic)](https://hub.docker.com/r/strm/temperature-monitor-backend/)
![License](https://img.shields.io/badge/License-GPL-blue.svg?style=plastic)

![dash](prints/dashboard.png)

# Up and Running



## Arduino

### Configure the firmware

### Arduino components & wiring



## Backend

### Docker setup

### Test backend

You can send some sample data to feed your backend, here is an example using curl

```
BACKEND='backend.project.com'
while true; do clear; date; curl -XPOST -H "Content-Type: application/json" -d '{"type": "temperature", "value": '$(( ( RANDOM % 30 )  + 5 ))',"device": 1,  "sensor": 123 }' http://$BACKEND:8080/temperature; sleep 4;done;
```

### Influxdb configuration



### Grafana configuration

#### Create datasource

Datasource creation is simplified, so you can just run the script bellow and get it configured for this environment

```
BACKEND='backend.project.com'
curl 'http://admin:admin@'$BACKEND':3000/api/datasources' -sq | grep sensors > /dev/null || curl 'http://admin:admin@'$BACKEND':3000/api/datasources' -X POST -H 'Content-Type: application/json;charset=UTF-8' --data-binary '{"name":"sensors","type":"influxdb","url":"http://database:8086","access":"proxy","isDefault":true,"database":"temperature"}'
```