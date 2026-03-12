package do_an_lien_nganh.laptop.sales.website.dto.order;

import do_an_lien_nganh.laptop.sales.website.enums.OrderPayment;
import do_an_lien_nganh.laptop.sales.website.enums.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderResponseShort {

    private Long id;
    private String customerName;
    private String phone;
    private String address;
    private Long totalPrice;
    private OrderPayment payment;
    private OrderStatus status;

    private LocalDateTime createdAt;

    private Integer totalItems;
}