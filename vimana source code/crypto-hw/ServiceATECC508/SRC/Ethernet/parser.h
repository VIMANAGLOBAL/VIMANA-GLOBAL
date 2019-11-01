

#ifndef PARSER_H_
#define PARSER_H_


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


typedef struct
{
   struct sockaddr_in  sockudp; 
   
   uint8_t          sock_data[1024*8]; 
   int              sock_data_len;
   
   int              channel;
   int              id;
   
   int              key_id;
     
   char             command[32];   
   uint8_t          cmd;
   
   uint8_t          hash[200];
   char             hash_char[400];
   int              hash_len;    

   uint8_t          signature[512];
   char             signature_char[1024];
   int              signature_len;    
   
   int8_t           pms[100];   
   int              pms_len;    

   uint8_t          public_key[200];
   char             public_key_char[400];
   int              public_key_len;    
   
   uint8_t          request_bin[1024*4];   
   char             request_char[1024*8];
   int              request_bin_len;
      
   int              ret;
   uint8_t          responce_bin[1024*4];   
   char             responce_char[1024*8];
   int              responce_bin_len;
   
   uint8_t          temp[1024*8];
   int              temp_len;
}query_t;


int		hex2bin(const char* hex, int hex_size, uint8_t* bin, int* bin_size);
void            bin2hex(uint8_t *bin, int len, char *hex);
int		ParserData(char *message, int len, query_t *query_lib_temp);
char *          DevSerialize(query_t* qlib);

void show_hex(uint8_t *data, int len);


#endif


