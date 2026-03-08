package do_an_lien_nganh.laptop.sales.website.controller;


import do_an_lien_nganh.laptop.sales.website.dto.ApiResponse;
import do_an_lien_nganh.laptop.sales.website.dto.statistic.DashboardResponse;
import do_an_lien_nganh.laptop.sales.website.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {

        DashboardResponse response = dashboardService.getDashboard();

        return ResponseEntity.ok(
                ApiResponse.success(response)
        );
    }

}