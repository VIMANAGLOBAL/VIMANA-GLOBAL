cmake_minimum_required(VERSION 3.0)
project (vimrypto)

set(P_VERSION "1.2.0")
enable_language("CXX")

include(GNUInstallDirs)

SET(GCC_COVERAGE_COMPILE_FLAGS "-f-nortti")

message("LIBDIR:${CMAKE_INSTALL_LIBDIR}")

#OpenSSL
find_package(OpenSSL REQUIRED)
message("OpenSSL include dir: ${OPENSSL_INCLUDE_DIR}")
message("OpenSSL libraries: ${OPENSSL_LIBRARIES}")
include_directories(${OPENSSL_INCLUDE_DIR})
list(APPEND LIB_LIST ${OPENSSL_LIBRARIES})


#GTEST
# Download and unpack googletest at configure time
configure_file(CMakeLists.txt.in googletest-download/CMakeLists.txt)
execute_process(COMMAND ${CMAKE_COMMAND} -G "${CMAKE_GENERATOR}" .
  RESULT_VARIABLE result
  WORKING_DIRECTORY ${CMAKE_BINARY_DIR}/googletest-download )
if(result)
  message(FATAL_ERROR "CMake step for googletest failed: ${result}")
endif()
execute_process(COMMAND ${CMAKE_COMMAND} --build .
  RESULT_VARIABLE result
  WORKING_DIRECTORY ${CMAKE_BINARY_DIR}/googletest-download )
if(result)
  message(FATAL_ERROR "Build step for googletest failed: ${result}")
endif()

# Prevent overriding the parent project's compiler/linker
# settings on Windows
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)

# Add googletest directly to our build. This defines
# the gtest and gtest_main targets.
add_subdirectory(${CMAKE_BINARY_DIR}/googletest-src
                 ${CMAKE_BINARY_DIR}/googletest-build
                 EXCLUDE_FROM_ALL)

# The gtest/gtest_main targets carry header search path
# dependencies automatically when using CMake 2.8.11 or
# later. Otherwise we have to add them here ourselves.
if (CMAKE_VERSION VERSION_LESS 2.8.11)
  include_directories("${gtest_SOURCE_DIR}/include")
endif()

# Now simply link against gtest or gtest_main as needed. Eg
#add_executable(example example.cpp)
#target_link_libraries(example gtest_main)
#add_test(NAME example_test COMMAND example)
#/GTEST

include_directories("include")
include_directories("include/DataFormat")
include_directories("src")

file(GLOB_RECURSE SRCS include/*.h include/DataFormat/*.h src/*.cpp src/*.h )
add_library(${PROJECT_NAME} SHARED ${SRCS} ${OPENSSL_LIBRARIES} )


#alter
#target_link_libraries( testPkg ssl crypto)
#target_link_libraries(${PROJECT_NAME}  gtest_main ssl crypto )

target_link_libraries(${PROJECT_NAME}  ssl crypto )

link_directories("/home/nemez/soft/vimana/fb-crypto-public/Cpp/build")

message("Project name: ${PROJECT_NAME}")


add_executable(${PROJECT_NAME}_exe testPackages/runTests.cpp ${HDRS} ${OPENSSL_LIBRARIES} )


#add_executable(${PROJECT_NAME}_exe ${HDRS} ${OPENSSL_LIBRARIES} )
target_link_libraries(${PROJECT_NAME}_exe ssl crypto vimrypto )


#add_executable (testPkg testPackages/runTests.cpp ${OPENSSL_LIBRARIES}  )




#install target
set_property(TARGET ${PROJECT_NAME} PROPERTY VERSION ${P_VERSION})
install(TARGETS ${PROJECT_NAME} 
        LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
	ARCHIVE DESTINATION ${CMAKE_INSTALL_LIBDIR}
	INCLUDES DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}
    )

# install headers
install(DIRECTORY include/ DESTINATION ${CMAKE_INSTALL_INCLUDEDIR})
