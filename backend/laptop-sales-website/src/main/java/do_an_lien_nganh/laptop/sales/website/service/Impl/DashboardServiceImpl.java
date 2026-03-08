package do_an_lien_nganh.laptop.sales.website.service.Impl;

import do_an_lien_nganh.laptop.sales.website.dto.order.OrderResponseShort;
import do_an_lien_nganh.laptop.sales.website.dto.statistic.*;
import do_an_lien_nganh.laptop.sales.website.entity.Order;
import do_an_lien_nganh.laptop.sales.website.enums.OrderStatus;
import do_an_lien_nganh.laptop.sales.website.mapper.OrderMapper;
import do_an_lien_nganh.laptop.sales.website.repository.LaptopRepository;
import do_an_lien_nganh.laptop.sales.website.repository.OrderItemRepository;
import do_an_lien_nganh.laptop.sales.website.repository.OrderRepository;
import do_an_lien_nganh.laptop.sales.website.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final LaptopRepository laptopRepository;

    public DashboardResponse getDashboard() {

        List<Order> orders = orderRepository.findAll();

        DashboardResponse response = new DashboardResponse();

        // ===== Tổng đơn =====
        response.setTotalOrders(orders.size());

        // ===== Tổng sản phẩm (laptop) =====
        response.setTotalProducts(laptopRepository.count());

        // ===== Pending orders =====
        long pendingOrders = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.pending)
                .count();

        response.setPendingOrders(pendingOrders);

        // ===== Revenue (đơn đã giao) =====
        long revenue = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.delivered)
                .mapToLong(Order::getTotalPrice)
                .sum();

        response.setRevenue(revenue);

        // ===== Status statistics =====
        Map<OrderStatus, Long> statusMap =
                orders.stream()
                        .collect(Collectors.groupingBy(
                                Order::getStatus,
                                Collectors.counting()
                        ));

        List<StatusStat> statusStats =
                statusMap.entrySet()
                        .stream()
                        .map(e -> new StatusStat(
                                e.getKey().name(),
                                e.getValue()
                        ))
                        .toList();

        response.setStatusStats(statusStats);

        // ===== Revenue by date =====
        Map<String, Long> revenueMap =
                orders.stream()
                        .filter(o -> o.getStatus() == OrderStatus.delivered)
                        .collect(Collectors.groupingBy(
                                o -> o.getCreatedAt().toString(),
                                Collectors.summingLong(Order::getTotalPrice)
                        ));

        List<RevenueByDate> revenueByDate =
                revenueMap.entrySet()
                        .stream()
                        .map(e -> new RevenueByDate(
                                e.getKey(),
                                e.getValue(),
                                e.getValue()
                        ))
                        .toList();

        response.setRevenueByDate(revenueByDate);

        // ===== Orders by date =====
        Map<String, Long> orderCountMap =
                orders.stream()
                        .collect(Collectors.groupingBy(
                                o -> o.getCreatedAt().atStartOfDay().toLocalDate().toString(),
                                Collectors.counting()
                        ));

        List<OrderCountByDate> ordersByDate =
                orderCountMap.entrySet()
                        .stream()
                        .map(e -> new OrderCountByDate(
                                e.getKey(),
                                e.getValue()
                        ))
                        .toList();

        response.setOrdersByDate(ordersByDate);

        // ===== Top selling products =====
        List<TopProduct> topProducts =
                orderItemRepository.getTopSellingProducts()
                        .stream()
                        .map(o -> new TopProduct(
                                (String) o[0],
                                ((Number) o[1]).longValue()
                        ))
                        .limit(6)
                        .toList();

        response.setTopProducts(topProducts);

        // ===== Recent orders =====
        List<OrderResponseShort> recentOrders =
                orders.stream()
                        .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                        .limit(5)
                        .map(OrderMapper::toShortResponse)
                        .toList();

        response.setRecentOrders(recentOrders);

        return response;
    }
}