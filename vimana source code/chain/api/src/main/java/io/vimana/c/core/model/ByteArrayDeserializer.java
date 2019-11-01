package io.vimana.vim.core.model;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.math.BigInteger;

/**
 *
 * @author al
 */
public class ByteArrayDeserializer extends StdDeserializer<Bytes> {

    public ByteArrayDeserializer() {
        super(Bytes.class);
    }
    @Override
    public Bytes deserialize(JsonParser jp, DeserializationContext dc) throws IOException, JsonProcessingException {
        JsonNode node = jp.getCodec().readTree(jp);
        String hex = node.asText();
        BigInteger bi = new BigInteger(hex, 16);
        return new Bytes(bi.toByteArray());
    }

}
