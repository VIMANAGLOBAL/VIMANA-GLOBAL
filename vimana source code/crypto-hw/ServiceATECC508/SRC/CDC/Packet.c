
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>
#include <string.h>
#include "libCDC.h"
#include "parser.h"
#include "Packet.h"


//******************************************************************************
void create_packet(uint8_t  channel, uint8_t CMD, uint8_t ID, uint8_t *data, int datalen, uint8_t* dataout, int *dataoutlen)
{
    //Out = new byte[len + 6];
    dataoutlen[0]=datalen+6;    
    //Out[0] = 0xF0;
    dataout[0]=0xF0;
    //Out[1] = channel;
    dataout[1]=channel;
    //Out[2] = (byte)(Out.Length - 4);
    dataout[2]=(uint8_t)(datalen +2);
    //Out[3] = (byte)((Out.Length - 4)>>8);
    dataout[3]=(uint8_t)((datalen +2)>>8);
    //Out[4] = ID;
    dataout[4]=ID;
    //Out[5] = CMD;
    dataout[5]=CMD;
    //if (len > 0) Array.Copy(data, 0, Out, 6, len);
    if(datalen>0) memcpy(dataout+6,data,datalen);    
}
//******************************************************************************
void parser_packet(uint8_t *dataIn, CMD_t *cmd)
{
    cmd->Channel=0xff;
    cmd->ID=0xff;
    cmd->CMD=0xff;
    cmd->ATE_STATUS=0xff;
    cmd->Zerro=0xff;
    cmd->DataLen=0x00;
    cmd->Data=0;
    
    if(dataIn[0]!=0x0f) return;
    cmd->Channel=dataIn[1];
    cmd->ID=dataIn[4];
    cmd->CMD=dataIn[5];
    cmd->ATE_STATUS=dataIn[6];
    cmd->Zerro=dataIn[7];
    cmd->DataLen=dataIn[2] + (dataIn[3] << 8) - 4;
    cmd->Data=dataIn+8;
    
}
//******************************************************************************


