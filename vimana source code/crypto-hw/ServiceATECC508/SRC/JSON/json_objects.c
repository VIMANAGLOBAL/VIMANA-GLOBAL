


#include "json_objects.h"

#include <stdint.h>
#include <limits.h>


const struct jsontree_object  *json_create_event_object(uint32_t id, const event_descriptor_t *evt)
{
	static struct jsontree_int j_id = {JSON_TYPE_INT};
	static struct jsontree_int j_type = {JSON_TYPE_INT};
	static struct jsontree_uint j_date = {JSON_TYPE_UINT};
	static struct jsontree_int j_arg0 = {JSON_TYPE_INT};
	static struct jsontree_int j_arg1 = {JSON_TYPE_INT};
	static struct jsontree_int j_arg2 = {JSON_TYPE_INT};
	static struct jsontree_int j_arg3 = {JSON_TYPE_INT};
	static struct jsontree_string j_text = {JSON_TYPE_STRING};

	JSONTREE_OBJECT(json_obj,
			JSONTREE_PAIR("id", &j_id),
			JSONTREE_PAIR("type", &j_type),
			JSONTREE_PAIR("date", &j_date),
			JSONTREE_PAIR("arg0", &j_arg0),
			JSONTREE_PAIR("arg1", &j_arg1),
			JSONTREE_PAIR("arg2", &j_arg2),
			JSONTREE_PAIR("arg3", &j_arg3),
			JSONTREE_PAIR("text", &j_text)
	);

	j_id.value = id;
	j_type.value = evt->type;
	j_arg0.value = evt->args[0];
	j_arg1.value = evt->args[1];
	j_arg2.value = evt->args[2];
	j_arg3.value = evt->args[3];
	j_text.value = evt->text;

	return &json_obj;
}
