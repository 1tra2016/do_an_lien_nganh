package do_an_lien_nganh.laptop.sales.website.dto.order;

import do_an_lien_nganh.laptop.sales.website.enums.OrderPayment;
import do_an_lien_nganh.laptop.sales.website.enums.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDetail {

    private Long id;

    private String customerName;
    private String phone;
    private String address;

    private String note;

    private OrderPayment payment;

    private Long originalPrice;
    private Long discount;
    private Long totalPrice;

    private String couponCode;

    private OrderStatus status;
    private String cancelReason;

    private LocalDateTime createdAt;

    private List<OrderItemResponse> items;
}