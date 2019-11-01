package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.vimana.vim.core.model.TaggedDataDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

@ApiModel
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ListTaggedDataResponse extends ResponseBase {

    @ApiModelProperty(value = "List of Tagged data entities")
    public List<TaggedDataDTO> data;

    public ListTaggedDataResponse(List<TaggedDataDTO> data) {
        this.data = data;
    }
}
