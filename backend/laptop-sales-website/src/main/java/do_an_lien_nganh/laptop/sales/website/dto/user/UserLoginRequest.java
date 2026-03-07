package do_an_lien_nganh.laptop.sales.website.dto.user;

import lombok.Data;

@Data
public class UserLoginRequest {
    private String email;
    private String password;
}
