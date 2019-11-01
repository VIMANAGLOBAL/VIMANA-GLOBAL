

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <termios.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <pthread.h>
#include <unistd.h>

//******************************************************************************
static pthread_mutex_t lock;

char *sComPort1 = "/dev/ttyACM0";
char *sComPort2 = "/dev/ttyACM1";
char *sComPort3 = "/dev/ttyACM2";

int fd_ComPort=0;

//******************************************************************************
int CDC_Open(char *port )
{
    if (pthread_mutex_init(&lock, NULL) != 0)
    {
        printf("\n mutex init failed\n");
        return -1;
    }

    
    fd_ComPort = open(port, O_RDWR  | O_NOCTTY);
    printf(" CDC_Open[%s]=%d\n\r",port, fd_ComPort);
    if(fd_ComPort>0) return 0;
    return fd_ComPort;    
}

int CDC_Close()
{
    if(fd_ComPort<1) return 0;
    close(fd_ComPort);
}

//******************************************************************************
int CDC_Write(uint8_t *data, int len)
{
    int outLen;
    
    pthread_mutex_lock(&lock);
    outLen=write(fd_ComPort, data, len);
    pthread_mutex_unlock(&lock);
    
    //printf(" CDC_Write=%d\n\r", outLen);
    
    if(outLen==len) return 0;
    return outLen;
}
//******************************************************************************    
int CDC_BytesAvailable(int *bytes_available)
{
    int ret;
    
    pthread_mutex_lock(&lock);
    bytes_available[0]=0;    
    ret=ioctl(fd_ComPort, FIONREAD, bytes_available);
    pthread_mutex_unlock(&lock);
    
    //printf(" CDC_BytesAvailable=%d \n\r", bytes_available[0]);
    
    return ret;        
}

//******************************************************************************   
void usleep(int);
//****************************************************************************** 
int CDC_ReadWait(uint8_t *data, int len)
{    
    int ret;
    int inLen;    
    int bytes_available=0;
    
    //struct timespec tim, tim2;
   //tim.tv_sec = 0;
   //tim.tv_nsec = 5000;
   
   if(len>4)
    do
    {
        ret=CDC_BytesAvailable(&bytes_available);
        if(ret<0)                   return ret;
        if(bytes_available>=len)    break;
        usleep(100);
        //nanosleep(&tim , &tim2);
    }
    while(1);
    
    
    //pthread_mutex_lock(&lock);
    inLen=read(fd_ComPort, data, len);
    //pthread_mutex_unlock(&lock);
    
    if(inLen!=len) return -1;    
    return 0;
}
//****************************************************************************** 
//##############################################################################
//COM>> F0 00 02 00 00 01 
//COM<< 0F 00 06 00 00 01 00 00 00 01 
//COM>> F0 01 02 00 01 04 
//COM<< 0F 01 0D 00 01 04 00 00 01 23 25 3E 0A CB 5F 9E EE 
//Channel:1 SN:01 23 25 3E 0A CB 5F 9E EE 
//##############################################################################

int CDC_ReadPacket(uint8_t *data, int *len)
{
    int ret;
    int len_packet;
    uint8_t temp[4];
    len[0]=0x00;
    ret=CDC_ReadWait(temp,4);
    if(ret!=0)          return ret;
    if(temp[0]!=0x0f)   return -100;
    len_packet=temp[2]+(temp[3]<<8);
    if(len_packet>4096) return -101;
    len[0]=len_packet+4;
    memcpy(data,temp,4);
    ret=CDC_ReadWait(data+4,len_packet);    
    return ret;
                               
}



//******************************************************************************
//******************************************************************************
//******************************************************************************
