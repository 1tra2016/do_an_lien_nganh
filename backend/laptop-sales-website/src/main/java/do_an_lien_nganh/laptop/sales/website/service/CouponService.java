package do_an_lien_nganh.laptop.sales.website.service;

import do_an_lien_nganh.laptop.sales.website.dto.coupon.CouponRequest;
import do_an_lien_nganh.laptop.sales.website.dto.coupon.CouponResponse;
import do_an_lien_nganh.laptop.sales.website.entity.Coupon;
import do_an_lien_nganh.laptop.sales.website.enums.CouponType;
import do_an_lien_nganh.laptop.sales.website.exception.ResourceNotFoundException;
import do_an_lien_nganh.laptop.sales.website.mapper.CouponMapper;
import do_an_lien_nganh.laptop.sales.website.repository.CouponRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

public interface CouponService {

    Coupon validateCoupon(String code, long orderTotal);
    long calculateDiscount(Coupon coupon, long total);
    CouponResponse createCoupon(CouponRequest request);
    CouponResponse updateCoupon(Long id, CouponRequest request);
    void deleteCoupon(Long id);
    CouponResponse getResponseCoupon(Long id);
    Coupon getCoupon(Long id);
    List<CouponResponse> getAllCoupons();


}
