package do_an_lien_nganh.laptop.sales.website.dto.order;

import do_an_lien_nganh.laptop.sales.website.enums.OrderPayment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private String userName;

    private String numberPhone;

    private String address;

    private String note;

    private OrderPayment payment;

    private String couponCode;
}