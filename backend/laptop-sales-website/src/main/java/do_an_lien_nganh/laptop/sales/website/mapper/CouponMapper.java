package do_an_lien_nganh.laptop.sales.website.mapper;

import do_an_lien_nganh.laptop.sales.website.dto.coupon.CouponRequest;
import do_an_lien_nganh.laptop.sales.website.dto.coupon.CouponResponse;
import do_an_lien_nganh.laptop.sales.website.entity.Coupon;

public class CouponMapper {

    public static Coupon toEntity(CouponRequest req){

        Coupon coupon = new Coupon();

        coupon.setCode(req.getCode());
        coupon.setType(req.getType());
        coupon.setDiscountValue(req.getDiscountValue());
        coupon.setMinOrderValue(req.getMinOrderValue());
        coupon.setMaxDiscount(req.getMaxDiscount());
        coupon.setUsageLimit(req.getUsageLimit());
        coupon.setExpiryDate(req.getExpiryDate());
        coupon.setUsedCount(0);

        return coupon;
    }

    public static CouponResponse toResponse(Coupon coupon){

        CouponResponse res = new CouponResponse();

        res.setId(coupon.getId());
        res.setCode(coupon.getCode());
        res.setType(coupon.getType());
        res.setDiscountValue(coupon.getDiscountValue());
        res.setMinOrderValue(coupon.getMinOrderValue());
        res.setMaxDiscount(coupon.getMaxDiscount());
        res.setUsageLimit(coupon.getUsageLimit());
        res.setUsedCount(coupon.getUsedCount());
        res.setExpiryDate(coupon.getExpiryDate());

        return res;
    }

    public static void updateEntity(Coupon coupon, CouponRequest request) {

        if (request.getCode() != null) coupon.setCode(request.getCode());

        if (request.getType() != null) coupon.setType(request.getType());

        if (request.getDiscountValue() != null)
            coupon.setDiscountValue(request.getDiscountValue());

        if (request.getMinOrderValue() != null)
            coupon.setMinOrderValue(request.getMinOrderValue());

        if (request.getMaxDiscount() != null)
            coupon.setMaxDiscount(request.getMaxDiscount());

        if (request.getUsageLimit() != null)
            coupon.setUsageLimit(request.getUsageLimit());

        if (request.getExpiryDate() != null)
            coupon.setExpiryDate(request.getExpiryDate());
    }
}