package io.vimana.vim.util;

/**
 *
 * @author al
 */
public class Converters {

    public static String toHexString(byte[] bytes) {

        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    public static Long parseUnsignedLong(String s) {
       return Long.parseUnsignedLong(s);
    }
}
