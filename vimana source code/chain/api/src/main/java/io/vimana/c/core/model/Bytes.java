
package io.vimana.vim.core.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * This class sole purpose is stupid serialization of byte[] 
 * @author al
 */
@JsonSerialize(using = ByteArraySerializer.class)
@JsonDeserialize(using = ByteArrayDeserializer.class)
public class Bytes {
    private byte[] bytes;

    public Bytes(byte[] bytes) {
        this.bytes = bytes;
    }

    public byte[] getBytes() {
        return bytes;
    }
}
