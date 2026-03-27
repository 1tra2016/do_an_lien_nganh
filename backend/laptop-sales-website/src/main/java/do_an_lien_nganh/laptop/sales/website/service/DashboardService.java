package do_an_lien_nganh.laptop.sales.website.service;

import do_an_lien_nganh.laptop.sales.website.dto.statistic.DashboardResponse;
import do_an_lien_nganh.laptop.sales.website.dto.statistic.RevenueByMonth;
import do_an_lien_nganh.laptop.sales.website.dto.statistic.TopProduct;

import java.util.List;

public interface DashboardService {
    DashboardResponse getDashboard(Integer month, Integer year);
    List<RevenueByMonth> getRevenueByMonth(Integer month, Integer year);
    List<TopProduct> getTopProducts(Integer month, Integer year);
}
