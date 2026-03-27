package do_an_lien_nganh.laptop.sales.website.service;

import do_an_lien_nganh.laptop.sales.website.dto.order.OrderRequest;
import do_an_lien_nganh.laptop.sales.website.dto.order.OrderResponseDetail;
import do_an_lien_nganh.laptop.sales.website.dto.order.OrderResponseShort;
import do_an_lien_nganh.laptop.sales.website.entity.*;
import do_an_lien_nganh.laptop.sales.website.enums.OrderStatus;
import do_an_lien_nganh.laptop.sales.website.mapper.OrderMapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public interface OrderService {
    List<OrderResponseShort> getAllOrders() ;
    List<OrderResponseShort> getAllOrders(Long id);

    OrderResponseShort getOrderShort(Long id);

    OrderResponseDetail getOrderDetail(Long id);
    void cancelOrder(Long orderId, String reason);
    OrderResponseShort updateStatus(Long orderId, String status);

    OrderResponseDetail createOrderFromCart(Long userId, OrderRequest req);

    List<Order> findAllBetweenTime(LocalDateTime start, LocalDateTime end);
    Long getTotalProductsSold(OrderStatus status, LocalDateTime start, LocalDateTime end);
}
