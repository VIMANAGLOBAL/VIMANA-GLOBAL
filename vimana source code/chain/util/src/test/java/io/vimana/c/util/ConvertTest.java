package io.vimana.vim.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ConvertTest {

    @Test
    public void bigValueTest() {
        System.out.print("Testing big number to long conversion.... ");
        String s = "16902256084123733045";
        Long l = Converters.parseUnsignedLong(s);
//        String ns = l.toString();
//        assertEquals(ns, s);
//        System.out.println("OK");
    }
}
