
package io.vimana.vim.util.cls;

/**
 *
 * @author alukin@gmail.com
 */
public class StringValueComparator implements ItemValueComparator {

    @Override
    public int compare(String one, String two) {
        return one.compareToIgnoreCase(two);
    }
    
}
