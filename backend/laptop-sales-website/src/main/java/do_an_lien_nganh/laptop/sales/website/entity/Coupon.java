package do_an_lien_nganh.laptop.sales.website.entity;

import do_an_lien_nganh.laptop.sales.website.enums.CouponType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    private CouponType type; // "percent" hoặc "fixed"
    private Long discountValue;
    private Long minOrderValue;
    private Long maxDiscount;
    private Integer usageLimit;
    private Integer usedCount;
    private LocalDateTime expiryDate;
}