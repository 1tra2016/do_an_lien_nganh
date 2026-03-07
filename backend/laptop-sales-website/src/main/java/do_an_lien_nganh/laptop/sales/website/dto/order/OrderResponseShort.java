package do_an_lien_nganh.laptop.sales.website.dto.order;

import do_an_lien_nganh.laptop.sales.website.enums.OrderPayment;
import do_an_lien_nganh.laptop.sales.website.enums.OrderStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class OrderResponseShort {

    private Long id;
    private String customerName;
    private String phone;
    private Long totalPrice;
    private OrderPayment payment;
    private OrderStatus status;

    private LocalDate createdAt;

    private Integer totalItems;
}