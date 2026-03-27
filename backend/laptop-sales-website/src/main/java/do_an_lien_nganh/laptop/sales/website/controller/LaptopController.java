package do_an_lien_nganh.laptop.sales.website.controller;

import do_an_lien_nganh.laptop.sales.website.dto.ApiResponse;
import do_an_lien_nganh.laptop.sales.website.dto.laptop.LaptopRequest;
import do_an_lien_nganh.laptop.sales.website.dto.laptop.LaptopResponseDetail;
import do_an_lien_nganh.laptop.sales.website.dto.laptop.LaptopResponseShort;
import do_an_lien_nganh.laptop.sales.website.entity.Laptop;
import do_an_lien_nganh.laptop.sales.website.mapper.LaptopMapper;
import do_an_lien_nganh.laptop.sales.website.service.LaptopService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/laptops")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Cho phép React gọi API từ domain khác
public class LaptopController {

    private final LaptopService laptopService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<LaptopResponseShort>>> getAllLaptops(
            @RequestParam(required = false) String keyword,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,

            @RequestParam(required = false) Integer brandId,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice,

            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "asc") String sortDir,

            @RequestParam(required = false) String stockStatus
    ) {

        Page<LaptopResponseShort> laptops =
                laptopService.getFilteredLaptops(keyword, page, size, brandId, minPrice, maxPrice, sortField, sortDir, stockStatus);

        return ResponseEntity.ok(ApiResponse.success(laptops));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LaptopResponseDetail>> createLaptop(@RequestBody LaptopRequest request) {
        LaptopResponseDetail response = laptopService.create(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<LaptopResponseDetail>> updateLaptop(
            @RequestBody LaptopRequest request,
            @PathVariable Long id) {
        LaptopResponseDetail response = laptopService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LaptopResponseDetail>> getLaptopById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(LaptopMapper.toLaptopResponseDetail(laptopService.getLaptopById(id))));
    }

    @GetMapping("/recommend")
    public ResponseEntity<ApiResponse<List<LaptopResponseShort>>> get4RecommendedLaptops() {
        return ResponseEntity.ok(ApiResponse.success(laptopService.get4RecommendedLaptops()));
    }

}