package io.vimana.vim.transport.peer;

/**
 * @author Mike Voloshyn
 */
@FunctionalInterface
public interface PeerFilter<T> {
    public boolean test(T t);
}
