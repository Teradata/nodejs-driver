#ifdef _WIN32
#include <windows.h>
#else
#include <unistd.h>
#endif

void udfsleep(int *seconds, int *result, char exception[6]) {
#ifdef _WIN32
    Sleep ((DWORD)*seconds * 1000);
#else
    sleep((unsigned int)*seconds);
#endif

    *result = 1;
}
