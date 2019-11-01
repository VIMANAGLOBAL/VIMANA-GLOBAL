
#include <stdio.h> //printf
#include <stdlib.h>
#include <string.h> //memset
#include <pthread.h>
#include <unistd.h>
#include "udp.h"
#include "udp_parser.h"



#ifndef _WIN32
#pragma comment(lib,"wininet.lib")
#pragma comment(lib,"ws2_32.lib")
pthread_mutex_t mutex_udp;
#endif

int udp_socket;

static pthread_mutex_t lock;
static pthread_mutex_t lock2;

int UDP_Send(struct sockaddr* sock, char* buf, int len);

 
#define BUFLEN 1024*8       //Max length of buffer
#define PORT 7777           //The port on which to listen for incoming data

 char buf[BUFLEN];

 
  
 //*****************************************************************************
//*****************************************************************************
int UDP_Init(void)
{
    struct sockaddr_in si_me;
          
    printf(" UDP Port [%d] Init ...\n", PORT);
    
     if (pthread_mutex_init(&lock, NULL) != 0)
    {
        printf("\n Mutex init failed...\n");
        return -1;
    }

     if (pthread_mutex_init(&lock2, NULL) != 0)
    {
        printf("\n Mutex init failed...\n");
        return -1;
    }
        
    //create a UDP socket
    if ((udp_socket=socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP)) == -1)
    {
        return -2;
    }
     
    // zero out the structure
    memset((char *) &si_me, 0, sizeof(si_me));
     
    si_me.sin_family = AF_INET;
    si_me.sin_port = htons(PORT);
    si_me.sin_addr.s_addr = htonl(INADDR_ANY);
     
    //bind socket to port
    if( bind(udp_socket , (struct sockaddr*)&si_me, sizeof(si_me) ) == -1)
    {
        printf("\n Bind socket failed...\n");
#ifndef _WIN32
        pthread_mutex_destroy(&mutex_udp);
#endif
        return -3;
    }
    
 
    return 0;
}

//*****************************************************************************
 int UDP_Send(struct sockaddr* sock, char* str, int str_len)
 {
     int Resp;
     pthread_mutex_lock(&lock);
     //now reply the client with the same data
     Resp=sendto(udp_socket, str, str_len, 0, (struct sockaddr*)sock, sizeof(struct sockaddr));
      pthread_mutex_unlock(&lock);
     return Resp;
 }
 
//*****************************************************************************
int UDP_Close(void)
{
    pthread_mutex_destroy(&lock);
    return 0;
}

query_t query_temp;
pthread_t thread_cdc=0;   
 


//*****************************************************************************
//**************************************************************************

void * Packet_Thread(void *data);
void * UDP_Thread(void *data)
{

 int socklen, recv_len;
 struct sockaddr_in  si_other;
 
    
 printf(" UDP_Thread Start...\r\n");
    //***********
    do
    {
        memset(buf,0,BUFLEN);
	socklen=sizeof(struct sockaddr);
        if ((recv_len = recvfrom(udp_socket, buf, BUFLEN, 0, (struct sockaddr *) &si_other, &socklen)) == -1)
        {
            printf("Error recvfrom \n\r ");
        }
        else
        {
     
			//print details of the client/peer and the data received
			//printf("Received packet from %s:%d\n\r", inet_ntoa(si_other.sin_addr), ntohs(si_other.sin_port));
			//printf("Data: %s\n" , buf);
        			                        
                     
                        
                        if (thread_cdc) if(pthread_join(thread_cdc, NULL)) 
                        {
                            fprintf(stderr, "Error joining thread\n");
                       
                        }
                        
                        memset(&query_temp,0,sizeof query_temp);
                        memcpy(&query_temp.sockudp, &si_other, sizeof(struct sockaddr));
                                                                                              
                        query_temp.sock_data_len=recv_len;   
                        memcpy(query_temp.sock_data, buf, recv_len );
                        
                        pthread_create(&thread_cdc, NULL, Packet_Thread, &query_temp);         
        }
    
    }while(1);
    
    printf(" UDP_Thread Close...\r\n");
    
    return NULL;
}    


//*****************************************************************************
void * Packet_Thread(void *data)
{
         
    query_t query;          
    memcpy(&query, data, sizeof(query_t) );     
    udp_parser(query.sock_data, query.sock_data_len, &query);    
}




