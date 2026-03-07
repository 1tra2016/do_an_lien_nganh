package do_an_lien_nganh.laptop.sales.website.service.Impl;

import do_an_lien_nganh.laptop.sales.website.dto.user.*;
import do_an_lien_nganh.laptop.sales.website.entity.Cart;
import do_an_lien_nganh.laptop.sales.website.entity.CartItem;
import do_an_lien_nganh.laptop.sales.website.entity.User;
import do_an_lien_nganh.laptop.sales.website.mapper.UserMapper;
import do_an_lien_nganh.laptop.sales.website.repository.UserRepository;
import do_an_lien_nganh.laptop.sales.website.service.CartService;
import do_an_lien_nganh.laptop.sales.website.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final CartService cartService;

    @Override
    public UserResponse createUser(UserCreateRequest request) {

        User user = userMapper.toUser(request);

        User savedUser = userRepository.save(user);

        return userMapper.toUserResponse(savedUser);
    }

    @Override
    public UserLoginResponse login(UserLoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        return userMapper.toLoginResponse(user);
    }

    @Override
    public UserResponse updateInfor(Long id, UserInfor request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userMapper.updateUser(user, request);

        User saved = userRepository.save(user);

        return userMapper.toUserResponse(saved);
    }

    @Override
    public UserInfor getUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userMapper.toUserInfor(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(user -> userMapper.toUserResponse(
                        user,
                        getTotalItems(user.getId())
                ))
                .toList();
    }

    @Override
    public Integer getTotalItems(Long userId) {

        Cart cart = cartService.getById(userId);
        List<CartItem> items = cart.getItems();
        int totalItems = 0;
        for (CartItem item : items) {
            totalItems += item.getQuantity();
        }
        return totalItems;
    }
}