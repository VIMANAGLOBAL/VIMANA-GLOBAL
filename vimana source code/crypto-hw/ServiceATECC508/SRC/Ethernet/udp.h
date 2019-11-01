
#ifndef UDP_H_
#define UDP_H_


#include <stdio.h> //printf
#include <string.h> //memset
#include <stdlib.h> //
#include <stdint.h>
#include <stdbool.h>


#ifndef _WIN32
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <netinet/ip.h>
#include <pthread.h>
#endif

#ifdef _WIN32



#include <winsock2.h>
#include <ws2tcpip.h>
#endif




int     UDP_Init(void);
int     UDP_Close(void);
int     UDP_Send(struct sockaddr* sock, char* str, int str_len);


void *UDP_Thread(void *);

 


#endif

