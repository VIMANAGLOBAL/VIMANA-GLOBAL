
#include <stdio.h> //printf
#include <stdlib.h>
#include <string.h> //memset
#include <pthread.h>
#include <unistd.h>

#include "CDC.h"
#include "libCDC.h"
#include "Packet.h"

#include "udp.h"
#include "udp_parser.h"
#include "Command.h"
#include "parser.h"

uint8_t     CDC_Buf[1024*8];
CMD_t       cmd;
query_t     query_resp;
//******************************************************************************
int CDC_Init(char *device)
{
    return  CDC_Open(device);
}
//******************************************************************************
void Init_Query(CMD_t *cmd, query_t *query )
{
    memset(query,0,sizeof(query_t));
    query->channel=cmd->Channel;
    query->cmd=cmd->CMD;        
    query->id=cmd->ID;
    query->ret=cmd->ATE_STATUS;
    query->responce_bin_len=cmd->DataLen;
    memcpy(query->responce_bin, cmd->Data, cmd->DataLen );
            
}

//******************************************************************************

void CMDBIN_to_CMDCHAR(CMD_t *cmd, query_t *query )
{
    switch(cmd->CMD)
    {
        case CMD_GET_INFO:
            strcpy(query->command,"get_info");            
            break;
	case CMD_AUTHORIZATION:
            strcpy(query->command,"authorization");
            break;
	case CMD_GET_SYS:
            strcpy(query->command,"get_sys");
            break;
	
	case CMD_GET_SN:
            strcpy(query->command,"get_sn");
            break;
 	case CMD_GET_LOCKS:
            strcpy(query->command,"get_locks");
            break;
	case CMD_GET_CONFIG:
            strcpy(query->command,"get_config");
            break;
	case CMD_SET_CONFIG_and_Lock:
            strcpy(query->command,"set_config_and_lock");
            break;
	case CMD_SIGN:
            strcpy(query->command,"sign");
            break;
	case CMD_VERIFY:
            strcpy(query->command,"verify");
            break;
	case CMD_VERIFY2:
            strcpy(query->command,"verify2");
            break;            
        case CMD_GET_RNG:
            strcpy(query->command,"get_rng");
            break;                        
	case CMD_ECDH:
            strcpy(query->command,"ecdh");
            break;
	case CMD_ECDHE:
            strcpy(query->command,"ecdhe");
            break;	
	case CMD_GEN_HW_CERT:
            strcpy(query->command,"create_cert");
            break;	
	case CMD_GEN_SW_CERT:
            strcpy(query->command,"gen_cert_sw");
            break;	
	case CMD_GEN_SW_KEY:
            strcpy(query->command,"gen_key_sw");
            break;	
	case CMD_ERROR:
            break;            
        case CMD_GET_HW_KEY:
            strcpy(query->command,"get_public_key");
            break;
        case CMD_GEN_HW_KEY:
            strcpy(query->command,"create_key");
            break;
        case CMD_GET_HW_CERT:
	    strcpy(query->command,"get_cert");
            break;
            
        case CMD_WRITE_USER_DATA:
            strcpy(query->command,"set_user_data");
            break;

        case CMD_READ_USER_DATA:
            strcpy(query->command,"get_user_data");
            break;

            

            
        default:
            strcpy(query->command,"no_name");
            break;
                
        
    }
    
}
//******************************************************************************
extern Dev_Channel_t Dev_Channel[4];

void *CDC_Thread(void *data)
{
    int Status;
    int Ret;
    int CDC_Buf_Len;
    char *udp_data;
        
     printf(" CDC_Thread Start...\r\n");
    
    do
    {                
        Status=CDC_ReadPacket(CDC_Buf, &CDC_Buf_Len);
        if(Status==0)
        {
            show_hex(CDC_Buf,CDC_Buf_Len);
            parser_packet(CDC_Buf, &cmd );            
            Init_Query(&cmd,&query_resp);
            memcpy(&query_resp.sockudp,  &Dev_Channel[cmd.Channel].query_udp, sizeof(struct sockaddr));
            CMDBIN_to_CMDCHAR(&cmd,&query_resp);
            udp_data=DevSerialize(&query_resp);
            UDP_Send((struct sockaddr *)&query_resp.sockudp, udp_data, strlen(udp_data));
            //printf("Send packet to %s:%d\n\r", inet_ntoa(query_resp.sockudp.sin_addr), ntohs(query_resp.sockudp.sin_port));
            
        }
         
    }while(1);
    
    printf(" CDC_Thread Close...\r\n");
    
    return NULL;
    
}

//*****************************************

