package do_an_lien_nganh.laptop.sales.website.controller;


import do_an_lien_nganh.laptop.sales.website.dto.ApiResponse;
import do_an_lien_nganh.laptop.sales.website.entity.Brand;
import do_an_lien_nganh.laptop.sales.website.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Cho phép React gọi API từ domain khác
public class BrandController {
    private final BrandService brandService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Brand>>> getAllBrands() {
        return ResponseEntity.ok(ApiResponse.success(brandService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Brand>> getBrand(
            @PathVariable Integer id
    ) {
        return ResponseEntity.ok(ApiResponse.success(brandService.findById(id)));
    }

    @PostMapping()
    public ResponseEntity<ApiResponse<Brand>> createBrand(
            @RequestBody Brand req
    ) {
        return ResponseEntity.ok(ApiResponse.success(brandService.createBrand(req)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Brand>> updateBrand(
            @PathVariable Integer id,
            @RequestBody Brand req
    ) {
        return ResponseEntity.ok(ApiResponse.success(brandService.updateBrand(id,req)));
    }

    @DeleteMapping("/{id}")
    public  ResponseEntity<ApiResponse> deleteBrand(
            @PathVariable Integer id
    ){
        brandService.deleteBrand(id);
        return ResponseEntity.ok(ApiResponse.success("xóa thành công"));
    }
}
