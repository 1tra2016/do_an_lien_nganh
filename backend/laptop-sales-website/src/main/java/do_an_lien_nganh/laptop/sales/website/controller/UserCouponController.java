package do_an_lien_nganh.laptop.sales.website.controller;

import do_an_lien_nganh.laptop.sales.website.dto.ApiResponse;
import do_an_lien_nganh.laptop.sales.website.dto.coupon.CouponResponse;
import do_an_lien_nganh.laptop.sales.website.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserCouponController {

    private final UserService userService;

    @GetMapping("/{userId}/coupons")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getUserCoupons(
            @PathVariable Long userId){

        return ResponseEntity.ok(
                ApiResponse.success(userService.getUserCoupons(userId))
        );
    }

    @PostMapping("/{userId}/coupons/{couponId}")
    public ResponseEntity<ApiResponse<String>> saveCoupon(
            @PathVariable Long userId,
            @PathVariable Long couponId){

        userService.saveCoupon(userId, couponId);

        return ResponseEntity.ok(ApiResponse.success("Coupon saved"));
    }
}
