package do_an_lien_nganh.laptop.sales.website.mapper;

import do_an_lien_nganh.laptop.sales.website.dto.cart.CartResponse;
import do_an_lien_nganh.laptop.sales.website.dto.cart.cartItem.CartItemResponse;
import do_an_lien_nganh.laptop.sales.website.entity.Cart;
import do_an_lien_nganh.laptop.sales.website.entity.CartItem;

import java.time.LocalDateTime;
import java.util.List;

public class CartMapper {
    public static CartItemResponse toResponse(CartItem item) {

        CartItemResponse res = new CartItemResponse();

        res.setId(item.getId());
        res.setLaptopId(item.getLaptop().getId());
        res.setLaptopName(item.getLaptop().getName());
        res.setPrice(item.getLaptop().getPrice());
        res.setQuantity(item.getQuantity());

        res.setSubtotal(item.getLaptop().getPrice() * item.getQuantity());

        return res;
    }

    public static CartResponse toResponse(Cart cart){
        CartResponse res = new CartResponse();
        res.setId(cart.getId());
        res.setUserId(cart.getUser().getId());

        List<CartItemResponse> items = cart.getItems()
                .stream()
                .map(CartMapper::toResponse)
                .toList();

        res.setItems(items);

        Long totalPrice = items.stream()
                .mapToLong(CartItemResponse::getSubtotal)
                .sum();

        res.setTotalPrice(totalPrice);
        res.setUpdatedAt(cart.getUpdatedAt());

        return res;
    }
}
