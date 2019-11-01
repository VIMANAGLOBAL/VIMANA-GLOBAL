
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>
#include <string.h>
#include "udp.h"
#include "udp_parser.h"
#include "json_utils.h"
#include "json_objects.h"
#include "parser.h"
#include "Packet.h"
#include "Command.h"
#include "libCDC.h"



Dev_Channel_t Dev_Channel[4];

//******************************************************************************



//******************************************************************************
//##############################################################################
//##############################################################################
//##############################################################################
void Dev_Not_Found(query_t* qlib)
{
    char *packet;
    qlib->ret=UDP_CMD_ERROR;
    packet=DevSerialize(qlib);
    UDP_Send((struct sockaddr *)&qlib->sockudp, packet, strlen(packet) );
}
//##############################################################################

//******************************************************************************
void Dev_open_channel(query_t* qlib)
{
    char *packet;
    int ch=qlib->channel;
    qlib->ret=0;
    
    if(ch<0) qlib->ret=UDP_CHANNEL_ERROR;
    if(ch>3) qlib->ret=UDP_CHANNEL_ERROR;
    if(qlib->ret==0)
    {
        Dev_Channel[ch].Open=1;
    }    
    qlib->responce_bin_len=1;
    qlib->responce_bin[0]=0x00;
    packet=DevSerialize(qlib);
    UDP_Send((struct sockaddr *)&qlib->sockudp, packet, strlen(packet) );            
}
//******************************************************************************
void Dev_close_channel(query_t* qlib)
{
    char *packet;
    int ch=qlib->channel;
    qlib->ret=0;
    
    if(ch<0) qlib->ret=UDP_CHANNEL_ERROR;
    if(ch>3) qlib->ret=UDP_CHANNEL_ERROR;
    if(qlib->ret==0)
    {
        Dev_Channel[ch].Open=0;
    }    
    qlib->responce_bin_len=1;
    qlib->responce_bin[0]=0x00;
    packet=DevSerialize(qlib);
    UDP_Send((struct sockaddr *)&qlib->sockudp, packet, strlen(packet) );            
}

//******************************************************************************
void Dev_cmd_only(query_t* qlib)
{
    char *packet;
    int ch=qlib->channel;
    qlib->ret=0;
    if(ch<1)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(ch>3)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(Dev_Channel[ch].Open!=1)     qlib->ret=UDP_OPEN_ERROR;
    if(qlib->ret!=0)
    {
        packet=DevSerialize(qlib);
        UDP_Send((struct sockaddr *)&qlib->sockudp, packet, strlen(packet) );
        return;
    }
    //void create_packet(uint8_t  channel, uint8_t CMD, uint8_t ID, uint8_t *data, int datalen, uint8_t* dataout, int *dataoutlen)
    
    create_packet(qlib->channel, qlib->cmd,  qlib->id, qlib->request_bin, qlib->request_bin_len,  qlib->temp, &qlib->temp_len );
    CDC_Write(qlib->temp, qlib->temp_len);
    show_hex(qlib->temp,qlib->temp_len);

}

//******************************************************************************

void Dev_get_sn(query_t* qlib)
{
    Dev_cmd_only(qlib);
}
//******************************************************************************
void Dev_get_locks(query_t* qlib)
{
     Dev_cmd_only(qlib);
}
//******************************************************************************
void Dev_create_cert(query_t* qlib)
{
     Dev_cmd_only(qlib);    
}
//******************************************************************************
void Dev_get_config(query_t* qlib)
{
     Dev_cmd_only(qlib);    
}
//******************************************************************************
void Dev_set_config(query_t* qlib)
{
     Dev_cmd_only(qlib);    
}
//******************************************************************************

void Dev_sign(query_t* qlib)
{
    char *packet;
    int ch=qlib->channel;
    qlib->ret=0;
    if(ch<0)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(ch>3)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(Dev_Channel[ch].Open!=1)     qlib->ret=UDP_OPEN_ERROR;
    
    if(qlib->hash_len!=32)          qlib->ret=UDP_PARAMETR_ERROR;
    if(qlib->key_id==-1)             qlib->ret=UDP_PARAMETR_ERROR;
    
    if(qlib->ret!=0)
    {
        packet=DevSerialize(qlib);
        UDP_Send((struct sockaddr *)&qlib->sockudp, packet, strlen(packet) );
        return;
    }
    
    qlib->request_bin[0]=(uint8_t)qlib->key_id;
    qlib->request_bin[1]=(uint8_t)(qlib->key_id>>8);
    memcpy(qlib->request_bin+2, qlib->hash,32);
    
    qlib->request_bin_len=34;
        
    create_packet(qlib->channel, qlib->cmd,  qlib->id, qlib->request_bin, qlib->request_bin_len,  qlib->temp, &qlib->temp_len );
    CDC_Write(qlib->temp, qlib->temp_len);
    show_hex(qlib->temp,qlib->temp_len);
}


//******************************************************************************
void Dev_verify(query_t* qlib)
{
    char *packet;
    int ch=qlib->channel;
    qlib->ret=0;
    if(ch<0)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(ch>3)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(Dev_Channel[ch].Open!=1)     qlib->ret=UDP_OPEN_ERROR;
    
    if(qlib->hash_len!=32)          qlib->ret=UDP_PARAMETR_ERROR;
    if(qlib->public_key_len!=65)   qlib->ret=UDP_PARAMETR_ERROR;
    if(qlib->signature_len!=64)     qlib->ret=UDP_PARAMETR_ERROR;
    
    if(qlib->ret!=0)
    {
        packet=DevSerialize(qlib);
        UDP_Send((struct sockaddr *)&qlib->sockudp, packet, strlen(packet) );
        return;
    }
    
    memcpy(qlib->request_bin+0,     qlib->hash,             32);
    memcpy(qlib->request_bin+32,    qlib->signature,        64);
    memcpy(qlib->request_bin+96,    qlib->public_key,       65);
    
    qlib->request_bin_len=32+64+65;
        
    create_packet(qlib->channel, qlib->cmd,  qlib->id, qlib->request_bin, qlib->request_bin_len,  qlib->temp, &qlib->temp_len );
    CDC_Write(qlib->temp, qlib->temp_len);
    show_hex(qlib->temp,qlib->temp_len);
    
}
//******************************************************************************
//******************************************************************************
void Dev_verify2(query_t* qlib)
{
    char *packet;
    int ch=qlib->channel;
    qlib->ret=0;
    if(ch<0)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(ch>3)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(Dev_Channel[ch].Open!=1)     qlib->ret=UDP_OPEN_ERROR;
    
    if(qlib->hash_len!=32)          qlib->ret=UDP_PARAMETR_ERROR;    
    if(qlib->key_id==-1)             qlib->ret=UDP_PARAMETR_ERROR;
    if(qlib->signature_len!=64)     qlib->ret=UDP_PARAMETR_ERROR;
    
    if(qlib->ret!=0)
    {
        packet=DevSerialize(qlib);
        UDP_Send((struct sockaddr *)&qlib->sockudp, packet, strlen(packet) );
        return;
    }
    
    qlib->request_bin[0]=(uint8_t)qlib->key_id;
    qlib->request_bin[1]=(uint8_t)(qlib->key_id>>8);
    memcpy(qlib->request_bin+2, qlib->hash,32);   
    memcpy(qlib->request_bin+2+32,    qlib->signature,        64);
        
    qlib->request_bin_len=2+32+64;
        
    create_packet(qlib->channel, qlib->cmd,  qlib->id, qlib->request_bin, qlib->request_bin_len,  qlib->temp, &qlib->temp_len );
    CDC_Write(qlib->temp, qlib->temp_len);
    show_hex(qlib->temp,qlib->temp_len);
    
}
//******************************************************************************
void Dev_ecdh(query_t* qlib)
{
     char *packet;
    int ch=qlib->channel;
    qlib->ret=0;
    if(ch<0)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(ch>3)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(Dev_Channel[ch].Open!=1)     qlib->ret=UDP_OPEN_ERROR;
        
    if(qlib->key_id==-1)             qlib->ret=UDP_PARAMETR_ERROR;
    if(qlib->public_key_len!=65)   qlib->ret=UDP_PARAMETR_ERROR;
    
    if(qlib->ret!=0)
    {
        packet=DevSerialize(qlib);
        UDP_Send((struct sockaddr *)&qlib->sockudp, packet, strlen(packet) );
        return;
    }
    
    qlib->request_bin[0]=(uint8_t)qlib->key_id;
    qlib->request_bin[1]=(uint8_t)(qlib->key_id>>8);
    memcpy(qlib->request_bin+2, qlib->public_key,65);
    
    qlib->request_bin_len=2+65;
        
    create_packet(qlib->channel, qlib->cmd,  qlib->id, qlib->request_bin, qlib->request_bin_len,  qlib->temp, &qlib->temp_len );
    CDC_Write(qlib->temp, qlib->temp_len);
    show_hex(qlib->temp,qlib->temp_len);
    
}
//******************************************************************************
void Dev_ecdhe(query_t* qlib)
{
     char *packet;
    int ch=qlib->channel;
    qlib->ret=0;
    if(ch<0)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(ch>3)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(Dev_Channel[ch].Open!=1)     qlib->ret=UDP_OPEN_ERROR;
            
    if(qlib->public_key_len!=65)   qlib->ret=UDP_PARAMETR_ERROR;
    
    if(qlib->ret!=0)
    {
        packet=DevSerialize(qlib);
        UDP_Send((struct sockaddr *)&qlib->sockudp, packet, strlen(packet) );
        return;
    }
    
    memcpy(qlib->request_bin, qlib->public_key,65);
    
    qlib->request_bin_len=65;
        
    create_packet(qlib->channel, qlib->cmd,  qlib->id, qlib->request_bin, qlib->request_bin_len,  qlib->temp, &qlib->temp_len );
    CDC_Write(qlib->temp, qlib->temp_len);
    show_hex(qlib->temp,qlib->temp_len);
    
}
//******************************************************************************
void Dev_get_cert(query_t* qlib)
{
    Dev_cmd_only(qlib);
}
//******************************************************************************
void Dev_set_user_data(query_t* qlib)
{
     char *packet;
    int ch=qlib->channel;
    qlib->ret=0;
    if(ch!=0)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(Dev_Channel[ch].Open!=1)     qlib->ret=UDP_OPEN_ERROR;
            
    if(qlib->ret!=0)
    {
        packet=DevSerialize(qlib);
        UDP_Send((struct sockaddr *)&qlib->sockudp, packet, strlen(packet) );
        return;
    }

    //Request fill
        
    create_packet(qlib->channel, qlib->cmd,  qlib->id, qlib->request_bin, qlib->request_bin_len,  qlib->temp, &qlib->temp_len );
    CDC_Write(qlib->temp, qlib->temp_len);
    show_hex(qlib->temp,qlib->temp_len);
    
}
//******************************************************************************
void Dev_get_user_data(query_t* qlib)
{
     char *packet;
    int ch=qlib->channel;
    qlib->ret=0;
    if(ch!=0)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(Dev_Channel[ch].Open!=1)     qlib->ret=UDP_OPEN_ERROR;
            
    if(qlib->ret!=0)
    {
        packet=DevSerialize(qlib);
        UDP_Send((struct sockaddr *)&qlib->sockudp, packet, strlen(packet) );
        return;
    }

    //Request fill
        
    create_packet(qlib->channel, qlib->cmd,  qlib->id, qlib->request_bin, qlib->request_bin_len,  qlib->temp, &qlib->temp_len );
    CDC_Write(qlib->temp, qlib->temp_len);
    show_hex(qlib->temp,qlib->temp_len);
    
    
}
//******************************************************************************
void Dev_get_rng(query_t* qlib)
{
      char *packet;
    int ch=qlib->channel;
    qlib->ret=0;
    //if(ch!=0)                       qlib->ret=UDP_CHANNEL_ERROR;
    if(Dev_Channel[ch].Open!=1)     qlib->ret=UDP_OPEN_ERROR;
            
    if(qlib->ret!=0)
    {
        packet=DevSerialize(qlib);
        UDP_Send((struct sockaddr *)&qlib->sockudp, packet, strlen(packet) );
        return;
    }

    //Request fill
        
    create_packet(qlib->channel, qlib->cmd,  qlib->id, qlib->request_bin, qlib->request_bin_len,  qlib->temp, &qlib->temp_len );
    CDC_Write(qlib->temp, qlib->temp_len);
    show_hex(qlib->temp,qlib->temp_len);
}
//******************************************************************************
void Dev_create_key(query_t* qlib)
{
      char *packet;
    int ch=qlib->channel;
    qlib->ret=0;
    if(ch<0)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(ch>3)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(Dev_Channel[ch].Open!=1)     qlib->ret=UDP_OPEN_ERROR;
    
   
    if(qlib->key_id==-1)             qlib->ret=UDP_PARAMETR_ERROR;
    
    if(qlib->ret!=0)
    {
        packet=DevSerialize(qlib);
        UDP_Send((struct sockaddr *)&qlib->sockudp, packet, strlen(packet) );
        return;
    }
    
    qlib->request_bin[0]=(uint8_t)qlib->key_id;        
    qlib->request_bin_len=1;
        
    create_packet(qlib->channel, qlib->cmd,  qlib->id, qlib->request_bin, qlib->request_bin_len,  qlib->temp, &qlib->temp_len );
    CDC_Write(qlib->temp, qlib->temp_len);
    show_hex(qlib->temp,qlib->temp_len);
    
}

//******************************************************************************
void Dev_get_public_key(query_t* qlib)
{
     char *packet;
    int ch=qlib->channel;
    qlib->ret=0;
    if(ch<1)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(ch>3)                        qlib->ret=UDP_CHANNEL_ERROR;
    if(Dev_Channel[ch].Open!=1)     qlib->ret=UDP_OPEN_ERROR;
    
   
    if(qlib->key_id==-1)             qlib->ret=UDP_PARAMETR_ERROR;
    
    if(qlib->ret!=0)
    {
        packet=DevSerialize(qlib);
        UDP_Send((struct sockaddr *)&qlib->sockudp, packet, strlen(packet) );
        return;
    }
    
    qlib->request_bin[0]=(uint8_t)qlib->key_id;        
    qlib->request_bin_len=1;
        
    create_packet(qlib->channel, qlib->cmd,  qlib->id, qlib->request_bin, qlib->request_bin_len,  qlib->temp, &qlib->temp_len );
    CDC_Write(qlib->temp, qlib->temp_len);
    show_hex(qlib->temp,qlib->temp_len);
}

//##############################################################################
//##############################################################################
//##############################################################################
//##############################################################################

Dev_Command_t  Dev_Command[]=
{    
  "open_channel",               Dev_open_channel,       0,
  "close_channel",              Dev_close_channel,      0,
  
  "get_sn",                     Dev_get_sn,             CMD_GET_SN,
  "get_locks",                  Dev_get_locks,          CMD_GET_LOCKS,
  "get_config",                 Dev_get_config,         CMD_GET_CONFIG,
  "set_config",                 Dev_set_config,         CMD_SET_CONFIG_and_Lock,

  "create_cert",                Dev_create_cert,        CMD_GEN_HW_CERT,  
  "get_cert",                   Dev_get_cert,           CMD_GET_HW_CERT,  
  
  "get_rng",                    Dev_get_rng,            CMD_GET_RNG,  
  "get_public_key",             Dev_get_public_key,     CMD_GET_HW_KEY,  
  "create_key",                 Dev_create_key,         CMD_GEN_HW_KEY,  
  
  "sign",                       Dev_sign,               CMD_SIGN,  
  "verify",                     Dev_verify,             CMD_VERIFY,  
  "verify2",                    Dev_verify2,            CMD_VERIFY2,  
  "ecdh",                       Dev_ecdh,               CMD_ECDH,  
  "ecdhe",                      Dev_ecdhe,              CMD_ECDHE,  
  
  "set_user_data",              Dev_set_user_data,      CMD_WRITE_USER_DATA,  
  "get_user_data",              Dev_get_user_data,      CMD_READ_USER_DATA,  
};

//##############################################################################
//##############################################################################
//##############################################################################
//******************************************************************************
//******************************************************************************
int Dev_Find_Command(query_t *qlib)
{
    int i;
    int Size = sizeof(Dev_Command) / sizeof(Dev_Command_t);
    for (i = 0;i < Size;i++)
    {
        if((strcmp(qlib->command, Dev_Command[i].CommandName))==0)
        {
            int ch=qlib->channel;
            
            if(ch!=-1 && ch<4) memcpy(&Dev_Channel[ch].query_udp.sockudp, &qlib->sockudp, sizeof(struct sockaddr));
            
            //printf("Command:%s\n\r",Dev_Command[i].CommandName);
            qlib->cmd=Dev_Command[i].CMD;
            Dev_Command[i].Proc(qlib);              
            return 1;
        }
    }    
        Dev_Not_Found(qlib);
	return 0;
}
//******************************************************************************


//******************************************************************************
void udp_parser(char *message, int len, query_t *query_temp)
{
    int Ret;
    query_temp->channel=-1;    
    query_temp->id=-1;
    query_temp->key_id=-1;
                
    ParserData(message,len, query_temp);
    Dev_Find_Command(query_temp);
   
}

//******************************************************************************

