#ifndef UDP_PARSER_H_
#define UDP_PARSER_H_

#include "parser.h"


//******************************************************************************
enum udp_error
{
    UDP_CMD_ERROR=1000,
    UDP_CHANNEL_ERROR,
    UDP_OPEN_ERROR,
    UDP_PARAMETR_ERROR,
    
} ;

//******************************************************************************
typedef struct 
{
    int         Open;
    query_t     query_udp;
    uint8_t     PMS[200];
    int         PMS_Lenght;
    uint8_t     PrivateKey[200];
    int         PrivateKeyLenght;
    uint8_t     PublickKey[200];
    int         PublickKeyLenght;
    uint8_t     Cert[1024];
    int         CertLenght;
       
}Dev_Channel_t ;



typedef struct
{
	const char *CommandName;
	void (*Proc)(query_t* qlib);
        uint8_t CMD;
}Dev_Command_t;


void udp_parser(char *message, int len, query_t *query_temp);

#endif



