#define SQL_TEXT Latin_Text
#include "sqltypes_td.h"
#include <string.h>
void xsp_getlastname(VARCHAR_LATIN *name,
                     char sqlstate[6])
{
  char tmp_string[30] if (strlen((const char *)name) > 0)
  {
    int offset = 0;
    int i = 0;
    strcpy(tmp_string, (char *)name);
    for (i = 0; i < 29; i +)
    {
      if (tmp_string[i] == ' ')
      {
        offset = (i + 1);
        break;
      }
    }

    strcpy((char *)name, &tmp_string[offset]);
  }
}
