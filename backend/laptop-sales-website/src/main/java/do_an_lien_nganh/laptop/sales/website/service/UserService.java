package do_an_lien_nganh.laptop.sales.website.service;

import do_an_lien_nganh.laptop.sales.website.dto.coupon.CouponResponse;
import do_an_lien_nganh.laptop.sales.website.dto.user.*;
import do_an_lien_nganh.laptop.sales.website.entity.User;

import java.util.List;

public interface UserService {

    User getById(Long id);
    UserResponse createUser(UserCreateRequest request);

    UserLoginResponse login(UserLoginRequest request);

    UserResponse updateInfor(Long id, UserInfor request);

    UserInfor getUser(Long id);
    List<UserResponse> getAllUsers();

    Integer getTotalItems(Long userId);

    List<CouponResponse> getUserCoupons(Long userId);
    void saveCoupon(Long userId, Long couponId);
}