package do_an_lien_nganh.laptop.sales.website.dto.statistic;

import do_an_lien_nganh.laptop.sales.website.dto.order.OrderResponseShort;
import lombok.Data;

import java.util.List;

@Data
public class DashboardResponse {

    private long revenue;
    private long totalOrders;
    private long totalProducts;
    private long pendingOrders;

    private List<StatusStat> statusStats;
    private List<RevenueByDate> revenueByDate;
    private List<TopProduct> topProducts;
    private List<OrderCountByDate> ordersByDate;

    private List<OrderResponseShort> recentOrders;
}