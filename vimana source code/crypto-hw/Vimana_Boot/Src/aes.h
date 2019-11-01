


//void MACInit(unsigned char *KeyENC,unsigned char *Ivec);



void AESInit(unsigned char *KeyENC);
void AESCbcDecrypt(unsigned char *Buf, int Len);
void AESCbcEncrypt(unsigned char *Buf, int Len);

void AES_ENCRYPT_BLOCK(unsigned char *InBuf, int Len);
void AES_DECRYPT_BLOCK(unsigned char *InBuf, int Len);


void AESOfb(unsigned char *Buf, int Len);

void AES_OFB_BLOCK(unsigned char *InBuf, int Len);

void MACInit(unsigned char *KeyENC);
void MAC_OFB_CalcBlock(unsigned char *InBuf, int Len, unsigned char *mac);//result IVEC_MAC

void AesGetToTemp(void);
void AesSetToTemp(void);




extern unsigned char IVEC_AES[16];
extern unsigned char IVEC_MAC[16];

