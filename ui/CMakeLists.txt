cmake_minimum_required(VERSION 2.8.0)
project(iBridge)

find_package(Qt4 4.7.1 COMPONENTS QtCore QtGui QtOpenGL QtNetwork QtDeclarative QtSvg QtWebkit REQUIRED)

include(${QT_USE_FILE})

set(SOURCE
main.cpp
)

QT4_WRAP_CPP(MOC_OUTFILES
bridge.h
)

#qt4_add_resources( RC_SRC_FILES ibridge.rc )

add_executable(iBridge ${SOURCE} ${MOC_OUTFILES} ${RC_SRC_FILES})
target_link_libraries(iBridge ${QT_LIBRARIES})
