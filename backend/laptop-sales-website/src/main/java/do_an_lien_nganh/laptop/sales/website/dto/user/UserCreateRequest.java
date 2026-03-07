package do_an_lien_nganh.laptop.sales.website.dto.user;

import lombok.Data;

@Data
public class UserCreateRequest {
    private String name;
    private String numberPhone;
    private String email;
    private String password;
}
