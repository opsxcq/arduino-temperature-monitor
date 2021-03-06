# A fullstack Arduino temperature monitor 
[![Docker Pulls](https://img.shields.io/docker/pulls/strm/temperature-monitor-backend.svg?style=plastic)](https://hub.docker.com/r/strm/temperature-monitor-backend/)
![License](https://img.shields.io/badge/License-GPL-blue.svg?style=plastic)

![dash](prints/dashboard.png)

# Up and Running



## Arduino

### Configure the firmware

Before everything else, you need to configure your arduino firmware to connect to your backend server. There is a script for that called `configure.sh`. This script takes 2 arguments, the first is the `hostname` where you deployed your backend and the second is the `port`. Example:

```
./configure.sh backend.project.com 8080
```

If everything is ok, you will get the output:

```
$./configure.sh backend.project.com 8080
[+] Configuring backend server
[+] Generating source files
[+] Done
```

### Arduino components & wiring

The components that you will need to setup this experiment:

* Arduino Uno R3
* Ethernet shield
* DHT11 - Temperature and Humidity sensor
* Cables
  * Ethernet cable
  * Power cable for arduino
  * 3 male -> female jumpers 

The wiring is very simple, just install the ethernet shield, wire the DHT11 pins to:

* `VCC` - 5V
* `GND` - Ground
* `Data` - Arduino digital pin 3.

### Compile and upload the firmware

You can use the `strm/dev-arduino` docker image to build this repository, just `cd` into the arduino folder and run

```
docker run --rm -it -v "$(pwd):/src" strm/dev-arduino build
```

If you don't have the image locally it will be downloaded, and this will be the output of a successful compilation.

```
Searching for Board description file (boards.txt) ... /usr/share/arduino/hardware/arduino/boards.txt
Searching for Arduino lib version file (version.txt) ... /usr/share/arduino/lib/version.txt
Detecting Arduino software version ...  1.0.5 (2:1.0.5+dfsg2-4)
Searching for Arduino core library ... /usr/share/arduino/hardware/arduino/cores/arduino
Searching for Arduino standard libraries ... /usr/share/arduino/libraries
Searching for Arduino variants directory ... /usr/share/arduino/hardware/arduino/variants
Searching for make ... /usr/share/arduino/hardware/tools/avr/bin/make
Searching for avr-gcc ... /usr/share/arduino/hardware/tools/avr/bin/avr-gcc
Searching for avr-g++ ... /usr/share/arduino/hardware/tools/avr/bin/avr-g++
Searching for avr-ar ... /usr/share/arduino/hardware/tools/avr/bin/avr-ar
Searching for avr-objcopy ... /usr/share/arduino/hardware/tools/avr/bin/avr-objcopy
src/sketch.ino
Searching for Arduino lib version file (version.txt) ... /usr/share/arduino/lib/version.txt
Detecting Arduino software version ...  1.0.5 (2:1.0.5+dfsg2-4)
Scanning dependencies of src
Scanning dependencies of arduino
Scanning dependencies of dht
Scanning dependencies of SPI
Scanning dependencies of Ethernet
src/sketch.cpp
dht/dht.cpp
Linking libdht.a
Ethernet/Dhcp.cpp
Ethernet/EthernetServer.cpp
Ethernet/Ethernet.cpp
Ethernet/EthernetClient.cpp
Ethernet/utility/socket.cpp
Ethernet/utility/w5100.cpp
Ethernet/EthernetUdp.cpp
Ethernet/Dns.cpp
Linking libEthernet.a
SPI/SPI.cpp
Linking libSPI.a
arduino/avr-libc/realloc.c
arduino/avr-libc/malloc.c
arduino/wiring_shift.c
arduino/wiring_digital.c
arduino/wiring.c
arduino/wiring_analog.c
arduino/WInterrupts.c
arduino/wiring_pulse.c
arduino/Stream.cpp
arduino/Tone.cpp
arduino/HardwareSerial.cpp
arduino/CDC.cpp
arduino/Print.cpp
arduino/USBCore.cpp
arduino/main.cpp
arduino/WMath.cpp
arduino/new.cpp
arduino/HID.cpp
arduino/WString.cpp
arduino/IPAddress.cpp
Linking libarduino.a
Linking firmware.elf
Converting to firmware.hex
```

After a successful compilation, connect your arduino to the USB port and run this command, in the same folder

```
docker run --rm -it -v "$(pwd):/src" --device=/dev/ttyUSB0 strm/dev-arduino upload
```

Considering that your Arduino is mapped to your USB located at `/dev/ttyUSB0`. Your result will be:

```
Searching for stty ... /bin/stty
Searching for avrdude ... /usr/share/arduino/hardware/tools/avrdude
Searching for avrdude.conf ... /usr/share/arduino/hardware/tools/avrdude.conf
Guessing serial port ... /dev/ttyUSB0

avrdude: AVR device initialized and ready to accept instructions

Reading | ################################################## | 100% 0.00s

avrdude: Device signature = 0x1e950f
avrdude: reading input file ".build/uno/firmware.hex"
avrdude: writing flash (16054 bytes):

Writing | ################################################## | 100% 2.66s

avrdude: 16054 bytes of flash written
avrdude: verifying flash memory against .build/uno/firmware.hex:
avrdude: load data flash data from input file .build/uno/firmware.hex:
avrdude: input file .build/uno/firmware.hex contains 16054 bytes
avrdude: reading on-chip flash data:

Reading | ################################################## | 100% 2.14s

avrdude: verifying ...
avrdude: 16054 bytes of flash verified

avrdude: safemode: Fuses OK (E:00, H:00, L:00)

avrdude done.  Thank you.
```



## Backend

### Docker setup

You will need docker to run this project, so you can download and install it with this command

```
curl -fsSL https://get.docker.com/ | sh
```

And docker compose with

```
curl -L "https://github.com/docker/compose/releases/download/1.8.1/docker-compose-$(uname -s)-$(uname -m)" > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```



### Start the backend 

Just go to the folder where your `docker-compose.yml` is located and run

```
docker-compose up
```

It will start the whole stack.

### Influxdb configuration

To access your Influxdb admin interface go to your backend at port `8083`. You will be presented to this page

![influx](prints/influxdb-main.png)

We will need to create our database to store the input data, so let's create a database named `temperature`. Execute this query:

```
CREATE DATABASE "temperature"
```

If everything went fine, you will be presented to this page

![influxsuccess](prints/influxdb-createdb.png)

### Grafana configuration

The very next step it to configure Grafana, where our data will be rendered.

#### Create datasource

Datasource creation is really simple, just run the script bellow and everything will be configured for this environment:

```
BACKEND='backend.project.com'
curl 'http://admin:admin@'$BACKEND':3000/api/datasources' -sq | grep sensors > /dev/null || curl 'http://admin:admin@'$BACKEND':3000/api/datasources' -X POST -H 'Content-Type: application/json;charset=UTF-8' --data-binary '{"name":"sensors","type":"influxdb","url":"http://database:8086","access":"proxy","isDefault":true,"database":"temperature"}'
```

Just replace the `BACKEND` variable with the location of your Grafana server.

#### Import the dashboard

The very next step is to import the dashboard, you don't need to create one, [use this one](dashboard.json). Access your Grafana interface at your backend host at the port `3000`. You will be presented to this page

![grafana](prints/grafana-login.png)

The default username is `admin` and the password too. Then go to `New Dashboard`.

![grafana-dash](prints/grafana-new-dash.png)

You can import a dashboard by clicking in the left menu and going into `Import`

![grafana-import](prints/grafana-import-dashboard.png)

Choose the `dashboard.json` file and you will get an empty dashboard, that after a while, will be filled with enought data like this.

![dash](prints/dashboard.png)

### Test backend with mock data

You can send some sample data to feed your backend, here is an example using curl

```
BACKEND='backend.project.com'
while true; do clear; date; curl -XPOST -H "Content-Type: application/json" -d '{"type": "temperature", "value": '$(( ( RANDOM % 30 )  + 5 ))',"device": 1,  "sensor": 123 }' http://$BACKEND:8080/temperature; sleep 4;done;
```

Just replace the `BACKEND` variable with the location of your backend server. So you can troubleshoot what is happening and test the whole backend stack.



# Security notice

As you can notice, all passwords are default, all services are exposed, and there is no security control, this is just a POC, but I strongly recommend that you don't deploy it in a production environment.