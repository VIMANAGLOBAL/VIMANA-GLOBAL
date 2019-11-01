
#ifndef PACKET_H_
#define PACKET_H_

#include <stdint.h>



typedef struct 
        {
            int         Usb_Status;
            uint8_t     Channel;
            uint8_t     CMD;
            uint8_t     ID;
            uint8_t     ATE_STATUS;
            uint8_t     Zerro;
            int         DataLen;
            uint8_t     *Data;
        }CMD_t;


        void create_packet(uint8_t  channel, uint8_t CMD, uint8_t ID, uint8_t *data, int datalen, uint8_t* dataout, int *dataoutlen);
        void parser_packet(uint8_t *dataIn, CMD_t *cmd);
        
        
#endif

        