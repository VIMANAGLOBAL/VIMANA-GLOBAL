
#ifndef SHA256_H


#define SHA256_H

void SHA256Init(void);
void SHA256Update(unsigned char *message, unsigned int len);
void SHA256Final(unsigned char *digest);


    

#endif
