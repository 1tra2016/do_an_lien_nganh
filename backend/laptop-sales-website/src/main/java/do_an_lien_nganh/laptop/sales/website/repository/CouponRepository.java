package do_an_lien_nganh.laptop.sales.website.repository;

import do_an_lien_nganh.laptop.sales.website.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface CouponRepository extends JpaRepository<Coupon,Long> {
    Coupon getCouponsByCode(String code);

    //xóa các coupon mà user đã lưu
    @Modifying
    @Query(value = "DELETE FROM user_saved_coupons WHERE coupon_id = :couponId", nativeQuery = true)
    void deleteSavedCouponsByCouponId(Long couponId);
}
