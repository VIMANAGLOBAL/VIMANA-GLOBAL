package io.vimana.vim.transport.peer;

import lombok.Getter;

import java.nio.ByteBuffer;

/**
 * @author Mike Voloshyn
 */

@Getter
public class TransportHeader {
    public static final int HEADER_SIZE = 16;
    ByteBuffer headerBuffer;
    int flags;
    int reserved;
    int applicationDataOffset;
    int applicationProtocol;

    public TransportHeader() {
    }

    public TransportHeader(byte[] headerBytes) {
        if (headerBytes.length != HEADER_SIZE) throw new RuntimeException("Error while reading message header!");
        headerBuffer = ByteBuffer.allocate(headerBytes.length);
        headerBuffer.put(headerBytes);
        flags = headerBuffer.getInt();
        reserved = headerBuffer.getInt();
        applicationDataOffset = headerBuffer.getInt();
        applicationProtocol = headerBuffer.getInt();
    }

    public boolean hasTransportJSON() {
        return applicationDataOffset > 0;
    }

    public boolean hasApplicationJSON() {
        return applicationDataOffset < 0;
    }

    public byte[] getHeaderbytes() {
        headerBuffer.rewind();
        byte[] buff = new byte[HEADER_SIZE];
        headerBuffer.get(buff);
        return buff;
    }

    public int getApplicationDataOffset() {
        return applicationDataOffset;
    }

    public TransportHeader setApplicationDataOffset(int applicationDataOffset) {
        this.applicationDataOffset = applicationDataOffset;
        return this;
    }

    public TransportHeader setFlags(int flags) {
        this.flags = flags;
        return this;
    }

    public TransportHeader setReserved(int reserved) {
        this.reserved = reserved;
        return this;
    }

    public TransportHeader setApplicationProtocol(int applicationProtocol) {
        this.applicationProtocol = applicationProtocol;
        return this;
    }

    @Override
    public String toString() {
        return Integer.toString(flags) + Integer.toString(reserved) +
                Integer.toString(applicationDataOffset) + Integer.toString(applicationProtocol);
    }
}
