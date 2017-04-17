#!/bin/bash

function usage(){
    echo '[-] Please inform hostname and port for backend server'
    echo '    Example: '
    echo '        ./configure.sh backend.project.com 8080'
}

function configure(){
    if [ ! -f ./arduino/src/config.h ]
    then
        echo '[-] Missing config.h, aborting'
        return -1
    fi
    local backend=$1
    local port=$2
    cat <<EOF
#ifndef Backend_h
#define Backend_h

char server[] = "$backend";
int serverPort = $port;

#endif
EOF
}


if [ -z "$2" ]
then
    usage
    exit -1
fi

configure $1 $2
