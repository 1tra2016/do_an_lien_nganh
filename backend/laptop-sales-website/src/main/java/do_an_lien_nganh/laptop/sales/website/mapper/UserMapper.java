package do_an_lien_nganh.laptop.sales.website.mapper;

import do_an_lien_nganh.laptop.sales.website.dto.user.UserCreateRequest;
import do_an_lien_nganh.laptop.sales.website.dto.user.UserLoginResponse;
import do_an_lien_nganh.laptop.sales.website.dto.user.UserResponse;
import do_an_lien_nganh.laptop.sales.website.dto.user.UserInfor;
import do_an_lien_nganh.laptop.sales.website.entity.User;
import do_an_lien_nganh.laptop.sales.website.enums.UserRole;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toUserResponse(User user, Integer totalItems) {
        if (user == null) return null;

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setNumberPhone(user.getNumberPhone());
        response.setRole(user.getRole());

        response.setTotalItems(totalItems);

        return response;
    }

    public UserResponse toUserResponse(User user) {
        if (user == null) return null;

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setNumberPhone(user.getNumberPhone());
        response.setRole(user.getRole());

        return response;
    }


    public UserLoginResponse toLoginResponse(User user) {
        UserLoginResponse response = new UserLoginResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setRole(user.getRole());
        return response;
    }

    public User toUser(UserCreateRequest request) {

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setNumberPhone(request.getNumberPhone());
        user.setPassword(request.getPassword());

        user.setRole(UserRole.user);

        return user;
    }

    public UserInfor toUserInfor(User user) {
        UserInfor userInfor = new UserInfor();
        userInfor.setEmail(user.getEmail());
        userInfor.setName(user.getName());
        userInfor.setNumberPhone(user.getNumberPhone());
        userInfor.setAddress(user.getAddress());

        return  userInfor;
    }

    public void updateUser(User user, UserInfor request) {

        if (request.getName() != null)
            user.setName(request.getName());

        if (request.getEmail() != null)
            user.setEmail(request.getEmail());

        if (request.getNumberPhone() != null)
            user.setNumberPhone(request.getNumberPhone());

        if (request.getAddress() != null)
            user.setAddress(request.getAddress());
    }
}