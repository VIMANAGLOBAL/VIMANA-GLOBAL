#ifndef CDC_H_
#define CDC_H_

#include <stdint.h>

int     CDC_Init(char *device);
void    *CDC_Thread(void*);


        
#endif
