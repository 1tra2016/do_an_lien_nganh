package do_an_lien_nganh.laptop.sales.website.controller;

import do_an_lien_nganh.laptop.sales.website.dto.ApiResponse;
import do_an_lien_nganh.laptop.sales.website.dto.user.*;
import do_an_lien_nganh.laptop.sales.website.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @RequestBody UserCreateRequest request
    ) {
        UserResponse response = userService.createUser(request);
        return ResponseEntity.ok(ApiResponse.success( "Tạo user thành công", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserLoginResponse>> login(
            @RequestBody UserLoginRequest request
    ) {
        UserLoginResponse response = userService.login(request);
        return ResponseEntity.ok(ApiResponse.success( "Login thành công", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserInfor>> updateInfor(
            @PathVariable Long id,
            @RequestBody UserInfor request
    ) {
        UserInfor response = userService.updateInfor(id, request);
        return ResponseEntity.ok(ApiResponse.success( "Cập nhật user thành công", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserInfor>> getUser(
            @PathVariable Long id
    ) {
        UserInfor response = userService.getUser(id);
        return ResponseEntity.ok(ApiResponse.success( "Ok đây là user của bạn", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers(){
        List<UserResponse> responses = userService.getAllUsers();

        return ResponseEntity.ok(ApiResponse.success( "Ok đây là user của bạn", responses));
    }

}