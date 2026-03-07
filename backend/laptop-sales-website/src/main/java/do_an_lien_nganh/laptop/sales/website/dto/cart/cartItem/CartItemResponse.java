package do_an_lien_nganh.laptop.sales.website.dto.cart.cartItem;

import lombok.Data;

@Data
public class CartItemResponse {

    private Long id;

    private Long laptopId;

    private String laptopName;

    private Long price;

    private Integer quantity;

    private Long subtotal; //logic quantity * price được thiết lập trong mapper, ở đây chỉ ghi thuộc tính

}
