
#include "stm32f4xx_hal.h"
#include "stdint.h"



//**********************************************************
int  FlashEraseSector(uint32_t FLASH_SECTOR) //FLASH_SECTOR_0 - FLASH_SECTOR_11
{

//Sector 0 0x0800 0000 - 0x0800 3FFF 16 Kbytes
//Sector 1 0x0800 4000 - 0x0800 7FFF 16 Kbytes
//Sector 2 0x0800 8000 - 0x0800 BFFF 16 Kbytes
//Sector 3 0x0800 C000 - 0x0800 FFFF 16 Kbytes
//Sector 4 0x0801 0000 - 0x0801 FFFF 64 Kbytes
//Sector 5 0x0802 0000 - 0x0803 FFFF 128 Kbytes
//Sector 6 0x0804 0000 - 0x0805 FFFF 128 Kbytes
//Sector 7 0x0806 0000 - 0x0807 FFFF 128 Kbytes
	
	
HAL_FLASH_Unlock();
__HAL_FLASH_CLEAR_FLAG(FLASH_FLAG_EOP | FLASH_FLAG_OPERR | FLASH_FLAG_WRPERR | FLASH_FLAG_PGAERR | FLASH_FLAG_PGPERR | FLASH_FLAG_PGSERR);

FLASH_Erase_Sector(FLASH_SECTOR, VOLTAGE_RANGE_3);
HAL_FLASH_Lock();	
return 0;
}

//**********************************************************

void FlashWritePage(uint32_t Address, uint32_t *Buffer, int Len )
{	
	HAL_FLASH_Unlock();
	__HAL_FLASH_CLEAR_FLAG(FLASH_FLAG_EOP | FLASH_FLAG_OPERR | FLASH_FLAG_WRPERR | FLASH_FLAG_PGAERR | FLASH_FLAG_PGPERR | FLASH_FLAG_PGSERR);
	for(int i=0;i<Len;i++)
	{
		HAL_FLASH_Program(FLASH_TYPEPROGRAM_WORD,Address,Buffer[i]);	
		Address+=4;
	}
	HAL_FLASH_Lock();
	
}

//****************************************************************************************************************
void FlashReadByteAddress(uint32_t Add, uint8_t *Buff8, int Len)
{
	uint8_t *pSrc=(uint8_t *)Add;
	for(int i=0;i<Len;i++)  Buff8[i]=pSrc[i];
}

//****************************************************************************************************************
