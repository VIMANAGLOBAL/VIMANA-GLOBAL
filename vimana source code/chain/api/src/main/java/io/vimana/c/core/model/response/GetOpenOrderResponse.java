package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.vimana.vim.core.model.OrderDTO;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class GetOpenOrderResponse extends ResponseBase{
    public OrderDTO[] openOrderDTOS;
    public OrderDTO[] bidOrderDTOS;
    public OrderDTO[] askOrderDTOS;
}
