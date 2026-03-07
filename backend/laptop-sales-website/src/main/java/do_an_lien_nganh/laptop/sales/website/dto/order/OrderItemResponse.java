package do_an_lien_nganh.laptop.sales.website.dto.order;

import lombok.Data;

@Data
public class OrderItemResponse {
    private Long id;
    private String name;
    private Long price;
    private Integer quantity;
    private String image;
}