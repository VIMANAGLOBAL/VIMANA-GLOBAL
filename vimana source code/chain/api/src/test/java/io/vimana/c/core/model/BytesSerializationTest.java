package io.vimana.vim.core.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.math.BigInteger;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


class BytesSerializationTest {
    private static final Logger log = LoggerFactory.getLogger(BytesSerializationTest.class);

    @Test
    void serializationTest() throws JsonProcessingException, IOException {
        log.debug("Testing Bytes serialization-deserialization");
        BigInteger bi = new BigInteger("baba0ded01234567890abcdef1234567890abcdef1234567890abcdef",16);
        GroupKeyInfoDTO gki = new GroupKeyInfoDTO();
        Bytes bytes = new Bytes(bi.toByteArray());
        gki.issuer_id=bytes;
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(gki);
        log.debug("JSON:\n {}",json);
        GroupKeyInfoDTO gki_back = mapper.readValue(json, GroupKeyInfoDTO.class);
        BigInteger bi_back = new BigInteger(gki_back.issuer_id.getBytes());
        Assertions.assertArrayEquals(bi.toByteArray(), bi_back.toByteArray());
    }
}