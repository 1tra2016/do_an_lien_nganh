package do_an_lien_nganh.laptop.sales.website.dto.user;

import do_an_lien_nganh.laptop.sales.website.enums.UserRole;
import lombok.Data;

@Data
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String numberPhone;

    private UserRole role; // "admin" hoặc "user"
    private Integer totalItems;
}
