



#ifndef JSON_UTILS_H_
#define JSON_UTILS_H_

#include "jsontree.h"
#include "jsonparse.h"


int json_write_buf(const struct jsontree_object *json_obj, char *buf, int size);


#endif /* JSON_UTILS_H_ */
