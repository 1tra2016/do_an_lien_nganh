package do_an_lien_nganh.laptop.sales.website.service;

import do_an_lien_nganh.laptop.sales.website.dto.cart.CartResponse;
import do_an_lien_nganh.laptop.sales.website.entity.Cart;

public interface CartService {
    Cart getById(Long id);
    CartResponse getUserCart(Long userId);
    CartResponse addLaptopToCart(Long userId, Long laptopId);
    CartResponse removeItem(Long userId, Long laptopId);
    CartResponse updateQuantity(Long userId, Long laptopId, Integer delta);
}
