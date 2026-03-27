package do_an_lien_nganh.laptop.sales.website.controller;


import do_an_lien_nganh.laptop.sales.website.dto.ApiResponse;
import do_an_lien_nganh.laptop.sales.website.dto.statistic.DashboardResponse;
import do_an_lien_nganh.laptop.sales.website.dto.statistic.RevenueByMonth;
import do_an_lien_nganh.laptop.sales.website.dto.statistic.TopProduct;
import do_an_lien_nganh.laptop.sales.website.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        DashboardResponse response = dashboardService.getDashboard(month, year);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/revenueByDate")
    public ResponseEntity<ApiResponse<List<RevenueByMonth>>> getRevenueByDate(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        List<RevenueByMonth> revenueByMonth = dashboardService.getRevenueByMonth(month, year);
        return ResponseEntity.ok(ApiResponse.success(revenueByMonth));
    }

    @GetMapping("/topProducts")
    public ResponseEntity<ApiResponse<List<TopProduct>>> getTopProducts(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {

        List<TopProduct> topPros = dashboardService.getTopProducts(month, year);
        return ResponseEntity.ok(ApiResponse.success(topPros));
    }

}