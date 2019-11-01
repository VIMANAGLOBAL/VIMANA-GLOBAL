

#include "stm32f4xx_hal.h"
#include "stdint.h"
#include <stdlib.h>
#include <stdint.h>
#include <string.h>

#include "Sha256.h"
#include "AES.h"


#define _pwd_ "VimHSM"

//****************************************************************************************************************
//****************************************************************************************************************
//****************************************************************************************************************

//Sector 6 0x0804 0000 
#define BaseProgramAddress 		0x08040000 


//Sector 4 0x0801 0000 - 0x0801 FFFF 64 Kbytes
//Sector 5 0x0802 0000 - 0x0803 FFFF 128 Kbytes
#define ReProgramAddress 			0x08010000 


//****************************************************************************************************************

int  FlashEraseSector(uint32_t FLASH_SECTOR) ;
void FlashWritePage(uint32_t Address, uint32_t *Buffer, int Len );
void FlashReadByteAddress(uint32_t Add, uint8_t *Buff8, int Len);
void FlashReadAddress(uint32_t Add, uint32_t *Buff32, int Len);


//****************************************************************************************************************
//****************************************************************************************************************
int Verify(void)
{
	int Address=(BaseProgramAddress+0x40);//64
	int Counter=0;
	int LenUpdate;
	int i;
	int Ret;
	uint8_t Version[16];//byte[] Version = { (byte)'V', (byte)'H', (byte)'S', (byte)'M', Ver_H, Ver_L, Build_L, Build_H, DateLL, DateLH, DateHL, DateHH, (byte)FileLen, (byte)(FileLen>>8), (byte)(FileLen >> 16), (byte)(FileLen >> 24) };
	uint8_t SHA256[32];
	uint8_t SHA256Temp[32];
	uint8_t Data[64];
	
	char  PWD[8];	

	AesGetToTemp();//tmp key
	
	FlashReadByteAddress(BaseProgramAddress+0x00,Version,				16);
	FlashReadByteAddress(BaseProgramAddress+0x10,SHA256Temp,		32);
	
	FlashReadByteAddress(ReProgramAddress+0x400,Data,		8);
	
	if(Version[0]!=(uint8_t)'V') return -1;
	if(Version[1]!=(uint8_t)'H') return -1;
	if(Version[2]!=(uint8_t)'S') return -1;
	if(Version[3]!=(uint8_t)'M') return -1;
	
	if(Version[4]==Data[0] && Version[5]==Data[1] && Version[6]==Data[2] &&   Version[7]==Data[3] ) return -2;
		
	
	
	strcpy(PWD,_pwd_);
	
	LenUpdate=Version[12]+(Version[13]<<8)+(Version[14]<<16)+(Version[15]<<24);
	PWD[6]=Version[4];
	PWD[7]=Version[5];
				
	SHA256Init();
	SHA256Update((unsigned char *)PWD, 8);
	SHA256Final(SHA256);
	AESInit(SHA256);
	
	SHA256Init();
	SHA256Update(Version,16);
	Counter=LenUpdate/64;
	for(i=0;i<Counter;i++)
	{
		FlashReadByteAddress(Address,Data,64);
		AESCbcDecrypt(Data,64);
		SHA256Update(Data,64);
		Address+=64;
	}
	SHA256Final(SHA256);
	
	AesSetToTemp();//tmp key
	Ret=memcmp(SHA256,SHA256Temp,32);
	return Ret;
	
	
}
//****************************************************************************************************************

uint8_t PageBuf[1024];

void Update(void)
{
	
	int AddressDF=BaseProgramAddress+0x40;//64
	int AddressCPU=ReProgramAddress;
	int Counter=0;
	int LenUpdate;
	int i;

	uint8_t Version[16];//byte[] Version = { (byte)'A', (byte)'C', (byte)'S', (byte)' ', Ver_H, Ver_L, Build_L, Build_H, DateLL, DateLH, DateHL, DateHH, (byte)FileLen, (byte)(FileLen>>8), (byte)(FileLen >> 16), (byte)(FileLen >> 24) };
	uint8_t SHA256[32];
	
		
	char  PWD[8];	//byte[] PWD = { (byte)'Q', (byte)'U', (byte)'A', (byte)'D', (byte)'R', (byte)'O', Ver_H, Ver_L};

	
	FlashEraseSector(FLASH_SECTOR_4);
	FlashEraseSector(FLASH_SECTOR_5);
	
	AesGetToTemp();//tmp key
	
	FlashReadByteAddress(BaseProgramAddress,Version,		16);	
	
	strcpy(PWD,_pwd_);
	
	LenUpdate=Version[12]+(Version[13]<<8)+(Version[14]<<16)+(Version[15]<<24);
	PWD[6]=Version[4];
	PWD[7]=Version[5];
				
	SHA256Init();
	SHA256Update((unsigned char *)PWD, 8);
	SHA256Final(SHA256);
	AESInit(SHA256);
	
	
		Counter=LenUpdate/1024;
		//_EEpromErasePage(AddressCPU,Counter);
	for(i=0;i<Counter;i++)
	{		
		FlashReadByteAddress(AddressDF,PageBuf,1024);
		AESCbcDecrypt(PageBuf,1024);
		FlashWritePage(AddressCPU,(uint32_t *)PageBuf,1024/4);		
		AddressCPU+=1024;
		AddressDF+=1024;				
	}

	
	FlashEraseSector(FLASH_SECTOR_6);
	
	
}

//****************************************************************************************************************
	
