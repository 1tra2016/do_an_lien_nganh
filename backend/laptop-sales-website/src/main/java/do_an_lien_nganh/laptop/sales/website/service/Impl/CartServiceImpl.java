package do_an_lien_nganh.laptop.sales.website.service.Impl;

import do_an_lien_nganh.laptop.sales.website.dto.cart.CartResponse;
import do_an_lien_nganh.laptop.sales.website.entity.Cart;
import do_an_lien_nganh.laptop.sales.website.entity.CartItem;
import do_an_lien_nganh.laptop.sales.website.entity.Laptop;
import do_an_lien_nganh.laptop.sales.website.exception.ResourceNotFoundException;
import do_an_lien_nganh.laptop.sales.website.mapper.CartMapper;
import do_an_lien_nganh.laptop.sales.website.repository.CartRepository;
import do_an_lien_nganh.laptop.sales.website.service.CartService;
import do_an_lien_nganh.laptop.sales.website.service.LaptopService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Transactional
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CartItemServiceImpl cartItemServiceImpl;
    private final LaptopService laptopService;

    @Override
    public Cart getById(Long id){
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        return cart;
    }

    @Override
    public CartResponse getUserCart(Long userId){

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        return CartMapper.toResponse(cart);
    }

    @Override
    public CartResponse addLaptopToCart(Long userId, Long laptopId){
        //kiểm tra tồn tại
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        Laptop laptop = laptopService.getLaptopById(laptopId);

        CartItem item = cartItemServiceImpl
                .findOptionalCartItemByCartIdAndLaptopId(cart.getId(), laptopId) //Tìm laptop nếu đã có
                .orElseGet(() -> { //Nếu chưa có trong cart, tiến thành tạo cartItem mới
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setLaptop(laptop);
                    newItem.setQuantity(0); //set 0 để lát tăng
                    cart.getItems().add(newItem);
                    return newItem;
                });

        laptopService.checkStock(laptopId, item.getQuantity() + 1);//Kiểm tra trước khi tăng quanity
        item.setQuantity(item.getQuantity() + 1); // tăng quanity cho cartItem mới tạo hoặc cartItem có sẵn

        //set update
        cart.setUpdatedAt(LocalDateTime.now());

        return CartMapper.toResponse(cart);
    }

    @Override
    public CartResponse removeItem(Long userId,Long laptopId){
        //kiểm tra tồn tại
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        CartItem cartItem = cartItemServiceImpl.findByCartIdAndLaptopId(cart.getId(), laptopId);

        cart.getItems().remove(cartItem);
        cartItemServiceImpl.delete(cartItem);

        //set update
        cart.setUpdatedAt(LocalDateTime.now());

        return CartMapper.toResponse(cart);
    }

    @Override
    public CartResponse updateQuantity(Long userId,Long laptopId, Integer delta){
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        CartItem cartItem = cartItemServiceImpl.findByCartIdAndLaptopId(cart.getId(), laptopId);

        int newQuantity =  cartItem.getQuantity() + delta;

        laptopService.checkStock(laptopId, newQuantity);

        if(newQuantity <= 0){
            cart.getItems().remove(cartItem);
            cartItemServiceImpl.delete(cartItem);
        } else {
            cartItem.setQuantity(newQuantity);
        }

        //set update
        cart.setUpdatedAt(LocalDateTime.now());

        return CartMapper.toResponse(cart);
    }
}
