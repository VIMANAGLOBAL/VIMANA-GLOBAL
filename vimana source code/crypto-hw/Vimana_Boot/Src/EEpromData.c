
#include "stm32f1xx_hal.h"
        					


#include <stdlib.h>
#include <stdint.h>
#include <string.h>

#include "spi.h"
#include "i2c.h"
#include "Sha256.h"
#include "AES.h"
#include "EEpromData.h"



//void FLASH_PageErase(uint32_t PageAddress);

//2097152 байт
//0x200000

#define UPDATE_DATA_ADDRESS_START		0x0000000
#define UPDATE_DATA_ADDRESS_END			0x007FF00 //512kбайт



//****************************************************************************************************************

//****************************************************************************************************************




//################################################################################################################
int  _EEpromErasePage(uint32_t Address, int Count)
{
	int Resp;
	HAL_FLASH_Unlock();
	__HAL_FLASH_CLEAR_FLAG(FLASH_FLAG_EOP | FLASH_FLAG_PGERR | FLASH_FLAG_WRPERR | FLASH_FLAG_BSY);	
	FLASH_EraseInitTypeDef EraseInitStruct;
	EraseInitStruct.PageAddress = Address;
	EraseInitStruct.TypeErase = FLASH_TYPEERASE_PAGES;
	EraseInitStruct.NbPages=Count;
	EraseInitStruct.Banks=0;
	uint32_t SectorError = 0;
	Resp=HAL_FLASHEx_Erase(&EraseInitStruct, &SectorError);
	if (Resp!= HAL_OK) 
	{ 
			HAL_FLASH_Lock();	
			return Resp ;
	}
	HAL_FLASH_Lock();	
	return 0;
}

//****************************************************************************************************************
void _EEpromWritePage(uint32_t Address, uint32_t *Buffer, int Len )
{	
	HAL_FLASH_Unlock();
	__HAL_FLASH_CLEAR_FLAG(FLASH_FLAG_EOP | FLASH_FLAG_PGERR | FLASH_FLAG_WRPERR | FLASH_FLAG_BSY);
	for(int i=0;i<Len;i++)
	{
		HAL_FLASH_Program(FLASH_TYPEPROGRAM_WORD,Address,Buffer[i]);	
		Address+=4;
	}
	HAL_FLASH_Lock();
	
}

//****************************************************************************************************************
void _EEpromReadAddress(uint32_t Add, uint32_t *Buff32, int Len)
{
	uint32_t *pSrc=(uint32_t *)Add;
	for(int i=0;i<Len;i++)  Buff32[i]=pSrc[i];
}

//****************************************************************************************************************

//################################################################################################################
//****************************************************************************************************************
//****************************************************************************************************************

//----------------------------------------------------------------------------------------------------------------
int  EEpromErasePage(uint32_t Address, int Count)
{
	volatile int Resp;
	do
	{		
		Resp=W25Q16_Erase64K(Address);
		if(Resp!=0) return Resp;
		Address+=64*1024;
		if(Count>0) Count--;		
	}while (Count>0);
	return 0;
}

//----------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------
void EEpromReadAddress(uint32_t Address, uint8_t *Buff32, int Len)
{
	volatile  int Resp;
	Resp=W25Q16_Read(Address, Buff32, Len);
	if(Resp!=0) return;

}
//----------------------------------------------------------------------------------------------------------------

//****************************************************************************************************************
//****************************************************************************************************************

//****************************************************************************************************************
//****************************************************************************************************************
//****************************************************************************************************************
int EEpromUpdateVerify(void)
{
	int Address=0x40;//64
	int Counter=0;
	int LenUpdate;
	int i;
	int Ret;
	uint8_t Version[16];//byte[] Version = { (byte)'A', (byte)'C', (byte)'S', (byte)' ', Ver_H, Ver_L, Build_L, Build_H, DateLL, DateLH, DateHL, DateHH, (byte)FileLen, (byte)(FileLen>>8), (byte)(FileLen >> 16), (byte)(FileLen >> 24) };
	uint8_t SHA256[32];
	uint8_t SHA256Temp[32];
	uint8_t Data[64];
	
	char  PWD[8];	//byte[] PWD = { (byte)'Q', (byte)'U', (byte)'A', (byte)'D', (byte)'R', (byte)'O', Ver_H, Ver_L};

	AesGetToTemp();//tmp key
	
	EEpromReadAddress(0x00,Version,		16);
	EEpromReadAddress(0x10,SHA256Temp,32);
	
	strcpy(PWD,"QUADRO");
	
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
		EEpromReadAddress(Address,Data,64);
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

void EEpromUpdate(void)
{
	
	int AddressDF=0x40;//64
	int AddressCPU=0x8000;
	int Counter=0;
	int LenUpdate;
	int i;

	uint8_t Version[16];//byte[] Version = { (byte)'A', (byte)'C', (byte)'S', (byte)' ', Ver_H, Ver_L, Build_L, Build_H, DateLL, DateLH, DateHL, DateHH, (byte)FileLen, (byte)(FileLen>>8), (byte)(FileLen >> 16), (byte)(FileLen >> 24) };
	uint8_t SHA256[32];
	
		
	char  PWD[8];	//byte[] PWD = { (byte)'Q', (byte)'U', (byte)'A', (byte)'D', (byte)'R', (byte)'O', Ver_H, Ver_L};

	AesGetToTemp();//tmp key
	
	EEpromReadAddress(0x00,Version,		16);	
	
	strcpy(PWD,"QUADRO");
	
	LenUpdate=Version[12]+(Version[13]<<8)+(Version[14]<<16)+(Version[15]<<24);
	PWD[6]=Version[4];
	PWD[7]=Version[5];
				
	SHA256Init();
	SHA256Update((unsigned char *)PWD, 8);
	SHA256Final(SHA256);
	AESInit(SHA256);
	
	
		Counter=LenUpdate/1024;
		_EEpromErasePage(AddressCPU,Counter);
	for(i=0;i<Counter;i++)
	{		
		EEpromReadAddress(AddressDF,PageBuf,1024);
		AESCbcDecrypt(PageBuf,1024);
		_EEpromWritePage(AddressCPU,(uint32_t *)PageBuf,1024/4);		
		AddressCPU+=1024;
		AddressDF+=1024;
		
		
	}

	
	
	
}

//****************************************************************************************************************
	

