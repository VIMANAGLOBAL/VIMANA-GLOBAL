package io.vimana.vim.core.model.i18n;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static io.vimana.vim.core.model.i18n.BlocksMessageBundle.MESSAGES;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class BlocksMessageBundleTest {
    private static final Logger log = LoggerFactory.getLogger(BlocksMessageBundleTest.class);

    @Test
    void blockNotFoundById() {
        String blockId = "AnyBlockId";
        String result = MESSAGES.blockNotFoundById(blockId);
        log.info(result);
        assertNotNull(result);
        assertTrue(result.contains(blockId));
        assertTrue(!result.contains("{"));
    }

    @Test
    void blockIncorrectByHeight() {
        int heightValue = 499023;
        String result = MESSAGES.blockIncorrectByHeight(heightValue);
        log.info(result);
        assertNotNull(result);
        assertTrue(result.contains(String.valueOf(heightValue)));
        assertTrue(!result.contains("{"));
    }

    @Test
    void blockIncorrectByTimestamp() {
        String timestamp = "3445677";
        String result = MESSAGES.blockIncorrectByTimestamp(timestamp);
        log.info(result);
        assertNotNull(result);
        assertTrue(result.contains(timestamp));
        timestamp = "AnyTimeStampStr3455$%^$%^$";
        result = MESSAGES.blockIncorrectByTimestamp(timestamp);
        log.info(result);
        assertNotNull(result);
        assertTrue(result.contains(timestamp));
        assertTrue(!result.contains("{"));
    }

    @Test
    void blockUnknownByParameters() {
        String blockId = "3445677";
        int heightValue = 3445656;
        int timestamp = 445;
        String result = MESSAGES.blockUnknownByParameters(blockId, heightValue, timestamp);
        log.info(result);
        assertNotNull(result);
        assertTrue(!result.contains("{"));
        assertAll("all checks", () -> {
            result.contains(blockId);
        }, ()-> {
            result.contains(String.valueOf(heightValue));
        }, ()-> {
            result.contains(String.valueOf(timestamp));
        });
        String result2 = MESSAGES.blockUnknownByParameters("AnyBlockId$%^^", heightValue, timestamp);
        log.info(result2);
        assertNotNull(result2);
        assertTrue(!result.contains("{"));
        assertAll("all checks", () -> {
            result2.contains(blockId);
        }, ()-> {
            result2.contains(String.valueOf(heightValue));
        }, ()-> {
            result2.contains(String.valueOf(timestamp));
        });
    }

    @Test
    void blockListIncorrectIndexParams() {
        String firstIndex = "3445677";
        String lastIndex = "3445656";
        String timestamp = "445";
        String result = MESSAGES.blockListIncorrectIndexParams(firstIndex, lastIndex, timestamp);
        log.info(result);
        assertNotNull(result);
        assertTrue(!result.contains("{"));
        assertAll("all checks", () -> {
            result.contains(String.valueOf(lastIndex));
        }, ()-> {
            result.contains(String.valueOf(lastIndex));
        }, ()-> {
            result.contains(String.valueOf(timestamp));
        });
    }
}