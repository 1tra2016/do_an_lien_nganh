package do_an_lien_nganh.laptop.sales.website.controller;

import do_an_lien_nganh.laptop.sales.website.dto.ApiResponse;
import do_an_lien_nganh.laptop.sales.website.dto.cart.CartResponse;
import do_an_lien_nganh.laptop.sales.website.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Cho phép React gọi API từ domain khác
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(
            @PathVariable Long userId) {
        CartResponse response = cartService.getUserCart(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{userId}/{laptopId}")
    public ResponseEntity<ApiResponse<CartResponse>> addLaptopToCart(
            @PathVariable Long userId,
            @PathVariable Long laptopId) {
        CartResponse response = cartService.addLaptopToCart(userId, laptopId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{userId}/{laptopId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateLaptopFromCart(
            @PathVariable Long userId,
            @PathVariable Long laptopId,
            @RequestParam Integer delta) {
        CartResponse response = cartService.updateQuantity(userId, laptopId, delta);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{userId}/{laptopId}")
    public ResponseEntity<ApiResponse> removeFromCart(
            @PathVariable Long userId,
            @PathVariable Long laptopId) {
        cartService.removeItem(userId, laptopId);
        return ResponseEntity.ok(ApiResponse.success("ok"));
    }
}
