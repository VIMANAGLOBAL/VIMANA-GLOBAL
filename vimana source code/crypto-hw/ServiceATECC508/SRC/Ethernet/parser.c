

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>
#include <string.h>

#include "json_utils.h"
#include "json_objects.h"
#include "parser.h"

//******************************************************************************

char    TempParser[1024*8];
uint8_t TempBin[1024*4];

//******************************************************************************
/**
 * \brief Checks to see if a character is an ASCII representation of a digit ((c ge '0') and (c le '9'))
 * \param[in] c  character to check
 * \return True if the character is a digit
 */
bool isDigit(char c)
{
    return (c >= '0') && (c <= '9');
}

/**
 * \brief Checks to see if a character is whitespace
 * \param[in] c  character to check
 * \return True if the character is whitespace
 */
bool isWhiteSpace(char c)
{
    return (c == '\n') || (c == '\r') || (c == '\t') || (c == ' ');
}

/**
 * \brief Checks to see if a character is an ASCII representation of hex ((c >= 'A') and (c <= 'F')) || ((c >= 'a') and (c <= 'f'))
 * \param[in] c  character to check
 * \return True if the character is a hex
 */
bool isAlpha(char c)
{
    return ((c >= 'A') && (c <= 'Z')) || ((c >= 'a') && (c <= 'z'));
}

/**
 * \brief Checks to see if a character is an ASCII representation of hex ((c >= 'A') and (c <= 'F')) || ((c >= 'a') and (c <= 'f'))
 * \param[in] c  character to check
 * \return True if the character is a hex
 */
bool isHexAlpha(char c)
{
    return ((c >= 'A') && (c <= 'F')) || ((c >= 'a') && (c <= 'f'));
}

bool isHexDigit(char c)
{
    return isDigit(c) || isHexAlpha(c);
}

inline static uint8_t hex_digit_to_num(char c)
{
    if (c >= '0' && c <= '9')
    {
        return (uint8_t)(c - '0');
    }
    if (c >= 'a' && c <= 'f')
    {
        return (uint8_t)(c - 'a') + 10;
    }
    if (c >= 'A' && c <= 'F')
    {
        return (uint8_t)(c - 'A') + 10;
    }
    return 16;
}

/** \brief Function that converts a hex string to binary buffer
 */

int hex2bin(const char* hex, int hex_size, uint8_t* bin, int* bin_size)
{
    int hex_index;
    int bin_index = 0;
    int is_upper_nibble = 1;

    for (hex_index = 0; hex_index < hex_size; hex_index++)
    {
        if (!isHexDigit(hex[hex_index]))
        {
            continue; // Skip any non-hex character
        }
       
        if (is_upper_nibble)
        {
            // Upper nibble
            bin[bin_index] = hex_digit_to_num(hex[hex_index]) << 4;
        }
        else
        {
            // Lower nibble
            bin[bin_index] += hex_digit_to_num(hex[hex_index]);
            bin_index++;
        }
        is_upper_nibble = !is_upper_nibble;
    }
    if (!is_upper_nibble)
    {
        // Didn't end with an even number of hex digits. Assume it was malformed.
        return -1;
    }
    *bin_size = bin_index;

    return 0;
}

//******************************************************************************

void show_hex(uint8_t *data, int len)
{
    
	//for (int i = 0;i<len;i++) printf("%02X ", data[i]);
        //printf("\n\r");
      
}


void bin2hex(uint8_t *bin, int len, char *hex)
{
	char Str[4];
	hex[0] = 0x00;

	for (int i = 0;i < len;i++)
	{
		sprintf(Str, "%02X", bin[i]);
		strcat(hex, Str);
	}
}


//******************************************************************************
int ParserData(char *message, int len, query_t *query_lib_temp)
{
    int type; 
    int bin=-1;  
    char Buf[16];
    
    struct jsonparse_state parser;
    jsonparse_setup(&parser, message, len);
    
	while ((type = jsonparse_next(&parser)) != 0)
	{
		if (type == JSON_TYPE_PAIR_NAME && parser.depth == 1)
		{
                    
                    
                    if (jsonparse_strcmp_value(&parser, "id") == 0)
                    {                                
                        jsonparse_next(&parser);
                        jsonparse_copy_value(&parser, Buf,  sizeof(Buf));
						query_lib_temp->id=jsonparse_get_value_as_uint(&parser);
                    }
                    
                    if (jsonparse_strcmp_value(&parser, "channel") == 0)
                    {                                
                        jsonparse_next(&parser);
                        jsonparse_copy_value(&parser, Buf,  sizeof(Buf));
						query_lib_temp->channel=jsonparse_get_value_as_uint(&parser);
                    }
                    

                    if (jsonparse_strcmp_value(&parser, "key_id") == 0)
                    {                                
                        jsonparse_next(&parser);
                        jsonparse_copy_value(&parser, Buf,  sizeof(Buf));
						query_lib_temp->key_id=jsonparse_get_value_as_uint(&parser);
                    }
                    
                    if (jsonparse_strcmp_value(&parser, "command") == 0)
                    {                                
                        jsonparse_next(&parser);
                        jsonparse_copy_value(&parser, query_lib_temp->command,  sizeof(query_lib_temp->command));
                    }
                    
                    if (jsonparse_strcmp_value(&parser, "request") == 0)
                    {                                
                        jsonparse_next(&parser);
                        jsonparse_copy_value(&parser, TempParser,  sizeof(TempParser));
                        bin=hex2bin(TempParser, strlen(TempParser), query_lib_temp->request_bin, &query_lib_temp->request_bin_len);
                    }

                    if (jsonparse_strcmp_value(&parser, "hash") == 0)
                    {                                
                        jsonparse_next(&parser);
                        jsonparse_copy_value(&parser, TempParser,  sizeof(TempParser));
                        bin=hex2bin(TempParser, strlen(TempParser), query_lib_temp->hash, &query_lib_temp->hash_len);
                    }

                    if (jsonparse_strcmp_value(&parser, "public_key") == 0)
                    {                                
                        jsonparse_next(&parser);
                        jsonparse_copy_value(&parser, TempParser,  sizeof(TempParser));
                        bin=hex2bin(TempParser, strlen(TempParser), query_lib_temp->public_key, &query_lib_temp->public_key_len);
                    }

                    if (jsonparse_strcmp_value(&parser, "signature") == 0)
                    {                                
                        jsonparse_next(&parser);
                        jsonparse_copy_value(&parser, TempParser,  sizeof(TempParser));
                        bin=hex2bin(TempParser, strlen(TempParser), query_lib_temp->signature, &query_lib_temp->signature_len);
                    }
                    
                }
        }
    
        
	return 1;
    
}
//******************************************************************************
//******************************************************************************
char DevSerializeStr[1024*8];
//******************************************************************************
char * DevSerialize(query_t* qlib)
{
    struct jsontree_int     j_channel =     { JSON_TYPE_INT,        qlib->channel};
    struct jsontree_int     j_id =          { JSON_TYPE_INT,        qlib->id };
    struct jsontree_string  j_command =     { JSON_TYPE_STRING,     qlib->command };            
    struct jsontree_int     j_key_id =      { JSON_TYPE_INT,        qlib->key_id };
    struct jsontree_string  j_responce =    { JSON_TYPE_STRING,     qlib->responce_char };        
    struct jsontree_string  j_hash =        { JSON_TYPE_STRING,     qlib->hash_char };    
    struct jsontree_string  j_public_key =  { JSON_TYPE_STRING,     qlib->public_key_char };    
    struct jsontree_string  j_signature =   { JSON_TYPE_STRING,     qlib->signature_char };  
    
    struct jsontree_int     j_ret =         { JSON_TYPE_INT,        qlib->ret };

    struct jsontree_pair pair_obj_err[] = {
            JSONTREE_PAIR("channel",   &j_channel),
            JSONTREE_PAIR("id",        &j_id),
            JSONTREE_PAIR("command",   &j_command),
            JSONTREE_PAIR("error",     &j_ret)
    };
    
    struct jsontree_pair pair_obj[] = {
            JSONTREE_PAIR("channel",   &j_channel),
            JSONTREE_PAIR("id",        &j_id),
            JSONTREE_PAIR("command",   &j_command),
            JSONTREE_PAIR("response",  &j_responce),
            
            //JSONTREE_PAIR("key_id",         &j_key_id),
            //JSONTREE_PAIR("hash",           &j_hash),
            //JSONTREE_PAIR("public_key",     &j_public_key),
            //JSONTREE_PAIR("signature",      &j_signature),
    };
    
    struct jsontree_object json_obj_err = {
            JSON_TYPE_OBJECT,
            sizeof(pair_obj_err) / sizeof(struct jsontree_pair),
            pair_obj_err
    };
    
    struct jsontree_object json_obj = {
            JSON_TYPE_OBJECT,
            sizeof(pair_obj) / sizeof(struct jsontree_pair),
            pair_obj
    };
        

    
    if(qlib->ret==0)
    {
	if(qlib->responce_bin_len)  bin2hex(qlib->responce_bin,     qlib->responce_bin_len,         qlib->responce_char);
        if(qlib->hash_len)          bin2hex(qlib->hash,             qlib->hash_len,                 qlib->hash_char);
        if(qlib->public_key_len)    bin2hex(qlib->public_key,       qlib->public_key_len,           qlib->public_key_char);
        if(qlib->signature_len)     bin2hex(qlib->signature,        qlib->signature_len,            qlib->signature_char);
        
        json_write_buf(&json_obj,       DevSerializeStr, sizeof(DevSerializeStr));
    }
    else
    {
        json_write_buf(&json_obj_err,   DevSerializeStr, sizeof(DevSerializeStr));
    }
         
    // printf("DevSerialize:%s\n\r", DevSerializeStr);
     return DevSerializeStr;
}
//******************************************************************************




