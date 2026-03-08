package do_an_lien_nganh.laptop.sales.website.controller;

import do_an_lien_nganh.laptop.sales.website.dto.ApiResponse;
import do_an_lien_nganh.laptop.sales.website.dto.coupon.CouponRequest;
import do_an_lien_nganh.laptop.sales.website.dto.coupon.CouponResponse;
import do_an_lien_nganh.laptop.sales.website.entity.Coupon;
import do_an_lien_nganh.laptop.sales.website.service.Impl.CouponServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Cho phép React gọi API từ domain khác
public class CouponController {

    private final CouponServiceImpl couponServiceImpl;

    // Tạo mã giảm giá
    @PostMapping
    public ResponseEntity<ApiResponse<CouponResponse>> createCoupon(@RequestBody CouponRequest request){
        CouponResponse response = couponServiceImpl.createCoupon(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // Cập nhật mã giảm giá
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<CouponResponse>> updateCoupon(
            @PathVariable Long id,
            @RequestBody CouponRequest request){

        return ResponseEntity.ok(ApiResponse.success(couponServiceImpl.updateCoupon(id, request)));
    }

    // Xóa mã giảm giá
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteCoupon(@PathVariable Long id){
        couponServiceImpl.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("ok"));
    }

    // Lấy 1 coupon
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CouponResponse>> getCoupon(@PathVariable Long id){
        CouponResponse response = couponServiceImpl.getResponseCoupon(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // Lấy tất cả coupon
    @GetMapping
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getAllCoupons(){
        return ResponseEntity.ok(ApiResponse.success(couponServiceImpl.getAllCoupons()));
    }


    // Kiểm tra coupon khi checkout
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Long>> validateCoupon(
            @RequestParam String code,
            @RequestParam long orderTotal){

        Coupon coupon = couponServiceImpl.validateCoupon(code, orderTotal);
        long discount = couponServiceImpl.calculateDiscount(coupon, orderTotal);

        return ResponseEntity.ok(ApiResponse.success(discount));
    }
}
