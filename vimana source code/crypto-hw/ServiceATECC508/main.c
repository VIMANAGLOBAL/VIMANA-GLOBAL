
/* 
 * File:   main.c
 * Author: yura
 *
 * Created on September 26, 2018, 2:01 PM
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>

#include "udp.h"
#include "libCDC.h"
#include "CDC.h"
#include "parser.h"


//#include <openssl/conf.h>
//#include <openssl/evp.h>
//#include <openssl/err.h>
//#include <openssl/ec.h>      // for EC_GROUP_new_by_curve_name, EC_GROUP_free, EC_KEY_new, EC_KEY_set_group, EC_KEY_generate_key, EC_KEY_free
//#include <openssl/ecdsa.h>   // for ECDSA_do_sign, ECDSA_do_verify
//#include <openssl/obj_mac.h> // for NID_secp192k1



uint8_t CmdDevInfo[]    ={0xF0, 0x00, 0x02, 0x00, 0x00, 0x01};
uint8_t CmdDevSN[]      ={0xF0, 0x01, 0x02, 0x00, 0x01, 0x04};
uint8_t CmdDevSign[]    ={0xF0, 0x01, 0x24, 0x00, 0x0C, 0x08, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};



uint8_t Buf[1024];

/*
int create_signature(unsigned char* hash)
{
    int function_status = -1;
    EC_KEY *eckey=EC_KEY_new();
    if (NULL == eckey)
    {
        printf("Failed to create new EC Key\n");
        function_status = -1;
    }
    else
    {
        EC_GROUP *ecgroup= EC_GROUP_new_by_curve_name(NID_secp521r1);
        if (NULL == ecgroup)
        {
            printf("Failed to create new EC Group\n");
            function_status = -1;
        }
        else
        {
            int set_group_status = EC_KEY_set_group(eckey,ecgroup);
            const int set_group_success = 1;
            if (set_group_success != set_group_status)
            {
                printf("Failed to set group for EC Key\n");
                function_status = -1;
            }
            else
            {
                const int gen_success = 1;
                int gen_status = EC_KEY_generate_key(eckey);
                if (gen_success != gen_status)
                {
                    printf("Failed to generate EC Key\n");
                    function_status = -1;
                }
                else
                {
                    ECDSA_SIG *signature = ECDSA_do_sign(hash, strlen(hash), eckey);
                    if (NULL == signature)
                    {
                        printf("Failed to generate EC Signature\n");
                        function_status = -1;
                    }
                    else
                    {

                        int verify_status = ECDSA_do_verify(hash, strlen(hash), signature, eckey);
                        const int verify_success = 1;
                        if (verify_success != verify_status)
                        {
                            printf("Failed to verify EC Signature\n");
                            function_status = -1;
                        }
                        else
                        {
                            printf("Verifed EC Signature\n");
                            function_status = 1;
                        }
                    }
                }
            }
            EC_GROUP_free(ecgroup);
        }
        EC_KEY_free(eckey);
    }

  return function_status;
}
 * */

//*******************************************************************************
//*******************************************************************************
//*******************************************************************************
int main(int argc, char** argv) 
{
    int Status;    
    printf("\n\rService ATECC508a ver 0.1...\r\n");
   
    //create_signature("Hello");
    
    Status=CDC_Open(sComPort1);
    if(Status!=0)
    {
        printf("/n/r CDC_Open Error =%d/n/r",Status);
        return Status;
    }
        
    Status=UDP_Init();
    if(Status!=0)
    {
        printf("/n/r UDP_Init Error =%d/n/r",Status);
        return Status;
    }
    
    pthread_t thread_udp;
    pthread_t thread_cdc;
    void* thread_data = NULL;
    
    pthread_create(&thread_udp, NULL, UDP_Thread, thread_data);
    pthread_create(&thread_cdc, NULL, CDC_Thread, thread_data);
        
    //ждем завершения потока
    pthread_join(thread_udp, NULL);
    pthread_join(thread_cdc, NULL);

    return (EXIT_SUCCESS);
}


//******************************************************************************
//******************************************************************************
//******************************************************************************