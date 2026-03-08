package do_an_lien_nganh.laptop.sales.website.mapper;

import do_an_lien_nganh.laptop.sales.website.dto.order.*;
import do_an_lien_nganh.laptop.sales.website.entity.Order;
import do_an_lien_nganh.laptop.sales.website.entity.OrderItem;

import java.util.List;

public class OrderMapper {

    public static OrderResponseShort toShortResponse(Order order) {

        OrderResponseShort res = new OrderResponseShort();

        res.setId(order.getId());
        res.setCustomerName(order.getCustomerName());
        res.setPhone(order.getPhone());
        res.setAddress(order.getAddress());

        res.setPayment(order.getPayment());
        res.setTotalPrice(order.getTotalPrice());
        res.setStatus(order.getStatus());
        res.setCreatedAt(order.getCreatedAt());

        // tính totalItems
        int totalItems = order.getItems()
                .stream()
                .mapToInt(OrderItem::getQuantity)
                .sum();

        res.setTotalItems(totalItems);
        return res;
    }

    public static OrderResponseDetail toDetailResponse(Order order) {

        OrderResponseDetail res = new OrderResponseDetail();

        res.setId(order.getId());
        res.setCustomerName(order.getCustomerName());
        res.setPhone(order.getPhone());
        res.setAddress(order.getAddress());
        res.setNote(order.getNote());

        res.setPayment(order.getPayment());

        res.setOriginalPrice(order.getOriginalPrice());
        res.setDiscount(order.getDiscount());
        res.setTotalPrice(order.getTotalPrice());

        res.setCouponCode(order.getCouponCode());

        res.setStatus(order.getStatus());
        res.setCancelReason(order.getCancelReason());

        res.setCreatedAt(order.getCreatedAt());

        List<OrderItemResponse> items = order.getItems()
                .stream()
                .map(OrderMapper::toItemResponse)
                .toList();

        res.setItems(items);

        return res;
    }

    public static OrderItemResponse toItemResponse(OrderItem item) {

        OrderItemResponse res = new OrderItemResponse();

        res.setId(item.getId());
        res.setName(item.getName());
        res.setPrice(item.getPrice());
        res.setQuantity(item.getQuantity());
        res.setImage(item.getImageMain());

        return res;
    }
}