package do_an_lien_nganh.laptop.sales.website.service.Impl;

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

@Service
@Transactional
@AllArgsConstructor
public class CouponServiceImpl {

    private final CouponRepository couponRepository;
    public Coupon validateCoupon(String code, long orderTotal){

        Coupon coupon = couponRepository.getCouponsByCode(code);

        if(coupon.getExpiryDate().isBefore(LocalDate.now())){
            throw new ResourceNotFoundException("Phiếu giảm giá đã hết hạn");
        }

        if(coupon.getUsedCount() >= coupon.getUsageLimit()){
            throw new ResourceNotFoundException("Phiếu giảm giá đã hết lượt dùng");
        }

        if(orderTotal < coupon.getMinOrderValue()){
            throw new ResourceNotFoundException("Không đạt giá trị tối thiểu để sử dụng phiếu giảm giá này");
        }

        return coupon;
    }

    public long calculateDiscount(Coupon coupon, long total){

        if(coupon.getType() == CouponType.percent){

            long discount = total * coupon.getDiscountValue() / 100;

            if(coupon.getMaxDiscount() != null){
                discount = Math.min(discount, coupon.getMaxDiscount());
            }

            return discount;
        }

        return coupon.getDiscountValue();
    }

    public CouponResponse createCoupon(CouponRequest request){

        Coupon coupon = CouponMapper.toEntity(request);

        couponRepository.save(coupon);

        return CouponMapper.toResponse(coupon);
    }

    public CouponResponse updateCoupon(Long id, CouponRequest request){

        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mã giảm giá"));

        CouponMapper.updateEntity(coupon, request);

        return CouponMapper.toResponse(coupon);
    }
    public void deleteCoupon(Long id){
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mã giảm giá"));

        couponRepository.delete(coupon);
    }

    public CouponResponse getCoupon(Long id){
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mã giảm giá"));

        return CouponMapper.toResponse(coupon);
    }

    public List<CouponResponse> getAllCoupons(){
        return couponRepository.findAll()
                .stream()
                .map(CouponMapper::toResponse)
                .toList();
    }

    public void usingCoupon(Coupon coupon){
        coupon.setUsedCount(coupon.getUsedCount()+1);
    }

}
