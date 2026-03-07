package do_an_lien_nganh.laptop.sales.website.dto.user;

import do_an_lien_nganh.laptop.sales.website.enums.UserRole;
import lombok.Data;

@Data
public class UserLoginResponse {
    private Long id;
    private String name;
    private UserRole role;
}

