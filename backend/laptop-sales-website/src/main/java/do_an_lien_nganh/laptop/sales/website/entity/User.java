package do_an_lien_nganh.laptop.sales.website.entity;

import do_an_lien_nganh.laptop.sales.website.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(unique = true)
    private String email;

    private String name;

    @NotNull
    @Column(unique = true)
    private String numberPhone;

    private String password;

    @Column(columnDefinition = "TEXT")
    private String address;

    @NotNull
    @Enumerated(EnumType.STRING) // cả buổi trời mới nhận ra
    private UserRole role; // "admin" hoặc "user"

    @ManyToMany
    @JoinTable(
            name = "user_saved_coupons",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "coupon_id")
    )
    private List<Coupon> savedCoupons;

}