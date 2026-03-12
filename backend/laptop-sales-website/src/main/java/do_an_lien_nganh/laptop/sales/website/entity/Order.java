package do_an_lien_nganh.laptop.sales.website.entity;

import do_an_lien_nganh.laptop.sales.website.enums.OrderPayment;
import do_an_lien_nganh.laptop.sales.website.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String customerName;
    private String phone;
    private String address;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Enumerated(EnumType.STRING)
    private OrderPayment payment; // "cod", "bank", "zalopay"

    private String couponCode;

    private Long originalPrice;
    private Long discount;
    private Long totalPrice;

    @Enumerated(EnumType.STRING)
    private OrderStatus status; // "pending", "confirmed", "delivered", "cancelled"
    private String cancelReason;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> items;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}


