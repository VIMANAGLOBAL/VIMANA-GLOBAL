package io.vimana.vim.core.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.vimana.vim.core.model.TagDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

@ApiModel
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GetDataTagsResponse extends ResponseBase {

    @ApiModelProperty(value = "List of tags")
    public List<TagDTO> tags;

    public GetDataTagsResponse(List<TagDTO> tags) {
        this.tags = tags;
    }
}
