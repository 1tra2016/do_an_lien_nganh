package do_an_lien_nganh.laptop.sales.website.controller;

import do_an_lien_nganh.laptop.sales.website.dto.ApiResponse;
import do_an_lien_nganh.laptop.sales.website.dto.laptop.LaptopRequest;
import do_an_lien_nganh.laptop.sales.website.dto.laptop.LaptopResponseDetail;
import do_an_lien_nganh.laptop.sales.website.entity.Laptop;
import do_an_lien_nganh.laptop.sales.website.service.LaptopService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<ApiResponse<List<Laptop>>> getLaptops(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice,
            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "asc") String sortDir) {

        List<Laptop> laptops = laptopService.getFilteredLaptops(brand, minPrice, maxPrice, sortField, sortDir);
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
    public ResponseEntity<ApiResponse<Laptop>> getLaptopById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(laptopService.getLaptopById(id)));
    }

}