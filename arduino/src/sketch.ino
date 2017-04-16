#include <SPI.h>
#include <Ethernet.h>

#include "dht.h"

// Ethernet related declarations
byte mac[] = { 0xDE, 0xAD, 0xC0, 0xDE, 0xBA, 0xBE };
char server[] = "10.1.1.5";
int serverPort = 8080;
IPAddress ip(10, 1, 1, 177);
EthernetClient client;

// Connection control
unsigned long lastContact = 0;
const unsigned long reportInterval = 10L * 1000L;

// Device related declarations
int deviceID = 1;
int sensorID = 1;

// Sensor related declarations
dht DHT;
#define DHT11_PIN 3

void setup(){
    Serial.begin(9600);
    // Begin the ethernet setup, tries to get an ip via DHCP
    if (Ethernet.begin(mac) == 0) {
        Serial.println("[-] Failed to configure network using DHCP, using manual ip address");
        // Set the fixed address in the card
        Ethernet.begin(mac, ip);
    }
    Serial.print("[+] Network started with address : ");
    Serial.println(Ethernet.localIP());
    // Wait until the ethernet initialize
    delay(1000);
}

void loop(){
    int chk = DHT.read11(DHT11_PIN);
    // TODO : Check if the result has erros

    if (client.connect(server, serverPort)) {
        Serial.println("[+] Connected to the backend server");
        // Make a HTTP request:
        client.println("POST /data HTTP/1.1");
        // TODO : Fix host
        client.println("Host: localhost:8080");
        client.println("User-Agent: strmduino/1.0");
        client.println("Accept: */*");
        client.println("Content-Type: application/json");
        client.println("Content-Length: 68");
        client.println("");
        
        // Send JSON event
        client.print("{\"type\": \"temperature\", \"value\": ");
        client.print(DHT.temperature);
        client.print(",\"device\": 1,  \"sensor\": 123 }");
        client.println();
        client.println();
        
        Serial.print("[+] Data uploaded: temperature= ");
        Serial.println(DHT.temperature);
        client.stop();
    } else {
        // We can't get the connection :(
        Serial.println("[-] Connection failed");
    }
    delay(10000);
}
