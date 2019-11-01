

#include "json_utils.h"
#include <stdint.h>

char *_json_buf;
int _json_buf_pos;
int _json_buf_size;
int _json_http_batch_pos;
int _json_putchar_error;




 int  json_buf_putchar(int c)
{
    if (_json_buf != NULL && !_json_putchar_error && _json_buf_pos < _json_buf_size)
    {
    	_json_buf[_json_buf_pos++] = c;
    	return c;
    }

    _json_putchar_error = 1;
    return 0;
}

int  json_write_buf(const struct jsontree_object *json_obj, char *buf, int size)
{
	struct jsontree_context ctx;

	_json_putchar_error = 0;
	_json_buf_pos = 0;
	_json_buf_size = size - 1; // reserved for \0
	_json_buf = buf;

	jsontree_setup(&ctx, (struct jsontree_value *)json_obj, json_buf_putchar);
	while (jsontree_print_next(&ctx) && ctx.path <= ctx.depth && !_json_putchar_error);

	if (_json_buf != NULL && _json_buf_pos < size)
		_json_buf[_json_buf_pos++] = '\0';

	_json_buf = NULL;

	return !_json_putchar_error;
}


