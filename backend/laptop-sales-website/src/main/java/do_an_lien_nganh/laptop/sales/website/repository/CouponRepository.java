package do_an_lien_nganh.laptop.sales.website.repository;

import do_an_lien_nganh.laptop.sales.website.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository extends JpaRepository<Coupon,Long> {
    Coupon getCouponsByCode(String code);
}
