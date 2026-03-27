package do_an_lien_nganh.laptop.sales.website.service.Impl;

import do_an_lien_nganh.laptop.sales.website.dto.DateRange;
import do_an_lien_nganh.laptop.sales.website.dto.order.OrderResponseShort;
import do_an_lien_nganh.laptop.sales.website.dto.statistic.*;
import do_an_lien_nganh.laptop.sales.website.entity.Order;
import do_an_lien_nganh.laptop.sales.website.enums.OrderStatus;
import do_an_lien_nganh.laptop.sales.website.mapper.OrderMapper;
import do_an_lien_nganh.laptop.sales.website.repository.LaptopRepository;
import do_an_lien_nganh.laptop.sales.website.repository.OrderItemRepository;
import do_an_lien_nganh.laptop.sales.website.repository.OrderRepository;
import do_an_lien_nganh.laptop.sales.website.service.DashboardService;
import do_an_lien_nganh.laptop.sales.website.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderItemRepository orderItemRepository;
    private final LaptopRepository laptopRepository;
    private final OrderService orderService;

    @Override
    public DashboardResponse getDashboard(Integer month, Integer year) {
        DateRange range = validateDate(month, year);

        List<Order> orders = orderService.findAllBetweenTime(range.getStart(), range.getEnd());;

        DashboardResponse response = new DashboardResponse();

        // ===== Tổng đơn =====
        response.setTotalOrders(orders.size());

        // ===== Tổng loại sản phẩm (laptop) =====
        response.setTotalProducts(laptopRepository.count());

        // ===== Tổng số sản phẩm đã bán =====
        Long totalSold = orderItemRepository.getTotalProductsSold(OrderStatus.delivered, range.getStart(), range.getEnd());
        response.setTotalSoldProducts(totalSold != null ? totalSold : 0);

        // ===== Các đơn đang chờ xử lý =====
        long pendingOrders = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.pending)
                .count();
        response.setPendingOrders(pendingOrders);

        // ===== Doanh thu (các đơn đã giao) =====
        long revenue = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.delivered)
                .mapToLong(Order::getTotalPrice)
                .sum();
        response.setRevenue(revenue);

        // ===== Số lượng trạng thái đơn hàng =====
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

        // ===== Số đơn theo ngày =====
        Map<String, Long> orderCountMap =
                orders.stream()
                        .collect(Collectors.groupingBy(
                                o -> o.getCreatedAt().toLocalDate().toString(),
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

        // ===== Các đơn gần đây =====
        List<OrderResponseShort> recentOrders =
                orders.stream()
                        .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                        .limit(5)
                        .map(OrderMapper::toShortResponse)
                        .toList();
        response.setRecentOrders(recentOrders);

        return response;
    }

    @Override
    public List<RevenueByMonth> getRevenueByMonth(Integer month, Integer year){
        DateRange range = validateDate(month, year);
        List<Order> orders = orderService.findAllBetweenTime(range.getStart(), range.getEnd());;

        // ===== Revenue by date =====
        Map<LocalDate, List<Order>> map =
                orders.stream()
                        .filter(o -> o.getStatus() == OrderStatus.delivered)
                        .collect(Collectors.groupingBy(
                                o -> o.getCreatedAt().toLocalDate()
                        ));

        List<RevenueByMonth> listRevenueByMonth =
                map.entrySet().stream()
                        .map(e -> {
                            long revenue = e.getValue()
                                    .stream()
                                    .mapToLong(Order::getTotalPrice)
                                    .sum();

                            long orderCount = e.getValue().size();

                            return new RevenueByMonth(
                                    e.getKey().toString(),
                                    revenue,
                                    orderCount
                            );
                        })
                        .sorted(Comparator.comparing(RevenueByMonth::getDate))
                        .toList();
        return listRevenueByMonth;
    }

    @Override
    public List<TopProduct> getTopProducts(Integer month, Integer year) {
        DateRange range = validateDate(month, year);

        List<TopProduct> listTopProducts = orderItemRepository.getTopSellingProducts(
                OrderStatus.delivered,
                range.getStart(),
                range.getEnd(),
                PageRequest.of(0, 5)
        );

        return listTopProducts;
    }

    private DateRange validateDate(Integer month, Integer year) {
        LocalDateTime start;
        LocalDateTime end;
        // ===== Case 1: year = null: lấy toàn bộ =====
        if (year == null) {
            return new DateRange(null, null);
        }

        // ===== Case 2: chỉ có year: lấy cả năm =====
        if (month == null) {
            start = LocalDate.of(year, 1, 1).atStartOfDay();
            end = start.plusYears(1);
            return new DateRange(start, end);
        }

        // ===== Case 3: có cả month + year =====
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Invalid month");
        }
        start = LocalDate.of(year, month, 1).atStartOfDay();
        end = start.plusMonths(1);
        return new DateRange(start, end);
    }
}