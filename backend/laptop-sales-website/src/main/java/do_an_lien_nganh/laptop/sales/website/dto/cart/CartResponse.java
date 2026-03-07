package do_an_lien_nganh.laptop.sales.website.dto.cart;

import do_an_lien_nganh.laptop.sales.website.dto.cart.cartItem.CartItemResponse;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CartResponse {

    private Long id;

    private Long userId;

    private List<CartItemResponse> items;

    private Long totalPrice;

    private LocalDateTime updatedAt;

}
