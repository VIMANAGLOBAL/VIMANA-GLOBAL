


#ifndef JSON_OBJECTS_H_
#define JSON_OBJECTS_H_

#include <stdint.h>
#include "jsontree.h"
#define EVENT_MAX_RECORDS		200
#define EVENT_TEXT_MAX_LENGTH	101

typedef enum {
	APP_EVENT_SYSTEM_INIT = 1,
	APP_EVENT_SYSTEM_REBOOT,
	APP_EVENT_SYSTEM_UPGRADE,
	APP_EVENT_MISC
} event_type_t;


typedef struct
{
	char			text[EVENT_TEXT_MAX_LENGTH];
	event_type_t	type;
	int32_t   		args[4];
} event_descriptor_t;


#define json_tls_sensor_state_value(a, b)	(a.have_##b ? (a.b##_set ? a.b : INT_MAX) : 0)

const struct jsontree_object *json_create_event_object(uint32_t id, const event_descriptor_t *evt);

#endif /* JSON_OBJECTS_H_ */
