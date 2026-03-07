package do_an_lien_nganh.laptop.sales.website.service;

import do_an_lien_nganh.laptop.sales.website.dto.user.*;

import java.util.List;

public interface UserService {

    UserResponse createUser(UserCreateRequest request);

    UserLoginResponse login(UserLoginRequest request);

    UserResponse updateInfor(Long id, UserInfor request);

    UserInfor getUser(Long id);
    List<UserResponse> getAllUsers();

    Integer getTotalItems(Long userId);
}