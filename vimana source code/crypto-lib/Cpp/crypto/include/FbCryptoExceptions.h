/* 
 * File:   vimryptoExceptions.h
 * Author: al
 */
#pragma once
#include <stdexcept>
#include <string>

class DestroyFailedException: public std::runtime_error
{
  public:
    DestroyFailedException(std::string const& message)
        : std::runtime_error(message + " Was thrown")
    {}
};

