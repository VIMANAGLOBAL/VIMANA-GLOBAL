/* 
 * File:   libATECC508.h
 * Author: yura
 *
 * Created on September 27, 2018, 4:31 PM
 */

#ifndef LIBATECC508_H
#define LIBATECC508_H

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>
#include <string.h>

#ifdef __cplusplus
extern "C" {
#endif

extern char *sComPort1;
extern char *sComPort2;
extern char *sComPort3;

extern int fd_ComPort;
    
    int CDC_Open(char *port );
    int CDC_Close(void);
    int CDC_Write(uint8_t *data, int len);
    int CDC_ReadWait(uint8_t *data, int len);
    int CDC_ReadPacket(uint8_t *data, int *len);
    
    

#ifdef __cplusplus
}
#endif

#endif /* LIBATECC508_H */


