package do_an_lien_nganh.laptop.sales.website.service.Impl;

import do_an_lien_nganh.laptop.sales.website.entity.CartItem;
import do_an_lien_nganh.laptop.sales.website.exception.ResourceNotFoundException;
import do_an_lien_nganh.laptop.sales.website.repository.CartItemRepository;
import do_an_lien_nganh.laptop.sales.website.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;

    @Override
    public CartItem findByCartIdAndLaptopId(Long CartId, Long laptopId) {
        CartItem item =  cartItemRepository.findByCartIdAndLaptopId(CartId, laptopId)
                .orElseThrow(() -> new ResourceNotFoundException("Laptop not found in this cart"));

        return item;
    }

    @Override
    public Optional<CartItem> findOptionalCartItemByCartIdAndLaptopId(Long CartId, Long laptopId) {
        return cartItemRepository.findOptionalByCartIdAndLaptopId(CartId, laptopId);
    }

    @Override
    public void delete(CartItem  cartItem) {
        cartItemRepository.delete(cartItem);
    }

}
