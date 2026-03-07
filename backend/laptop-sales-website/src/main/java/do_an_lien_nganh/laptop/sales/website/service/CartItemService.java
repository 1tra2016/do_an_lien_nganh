package do_an_lien_nganh.laptop.sales.website.service;

import do_an_lien_nganh.laptop.sales.website.entity.CartItem;

import java.util.Optional;

public interface CartItemService {
    CartItem findByCartIdAndLaptopId(Long CartId, Long laptopId);
    Optional<CartItem> findOptionalCartItemByCartIdAndLaptopId(Long CartId, Long laptopId);
    void delete(CartItem cartItem);
}