
#ifndef _Command_H_
#define _Command_H_

#include <stdint.h>

//********************************************
typedef enum
{
	
	CMD_GET_INFO=1,
	CMD_AUTHORIZATION=2,
	CMD_GET_SYS=3,
	
	CMD_GET_SN=4,
	CMD_GET_LOCKS=5,
	CMD_GET_CONFIG=6,
	CMD_SET_CONFIG_and_Lock=7,
	CMD_SIGN=8,
	CMD_VERIFY=9,
        CMD_VERIFY2=10,
        CMD_GET_RNG=11,
	CMD_ECDH=12,
	CMD_ECDHE=13,
	CMD_GET_HW_KEY=14,
        CMD_GEN_HW_KEY=15,
	CMD_GEN_HW_CERT=0x10,
        CMD_GET_HW_CERT=0x11,
	
	CMD_GEN_SW_CERT=0x80,	
	CMD_GEN_SW_KEY=0x90,
        CMD_WRITE_USER_DATA = 0xb0,
        CMD_READ_USER_DATA = 0xb1,
                	
	CMD_ERROR=0xFF
	


	
} Command_t;

//********************************************

#endif

