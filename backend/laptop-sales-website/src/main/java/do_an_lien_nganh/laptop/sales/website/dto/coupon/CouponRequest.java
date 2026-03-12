package do_an_lien_nganh.laptop.sales.website.dto.coupon;

import do_an_lien_nganh.laptop.sales.website.enums.CouponType;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class CouponRequest {
    private String code;
    private CouponType type; // "percent" hoặc "fixed"
    private Long discountValue;
    private Long minOrderValue;
    private Long maxDiscount;
    private Integer usageLimit;
    private Integer usedCount;
    private LocalDateTime expiryDate;
}
