

int  FlashEraseSector(uint32_t FLASH_SECTOR) ;
void FlashWritePage(uint32_t Address, uint32_t *Buffer, int Len );
void FlashReadByteAddress(uint32_t Add, uint8_t *Buff8, int Len);
void FlashReadAddress(uint32_t Add, uint32_t *Buff32, int Len);

