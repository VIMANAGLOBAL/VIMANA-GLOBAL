package io.vimana.cryptoutils;

import com.beust.jcommander.IParameterValidator;
import com.beust.jcommander.ParameterException;
import java.util.Arrays;

/**
 *
 * @author al
 */
public class RqTypeValidator implements IParameterValidator {
    
    public static final String[] RQ_TYPES = {"personal", "host", "softsign"};

    @Override
    public void validate(String name, String value) throws ParameterException {
        boolean found = false;
        for (String p : RQ_TYPES) {
            if (p.equalsIgnoreCase(value)) {
                found = true;
                break;
            }
        }
        if (!found) {
            throw new ParameterException("Parameter " + name + " should be one of:" + Arrays.toString(RQ_TYPES) + " (found " + value + ")");
        }
    }
    
}
