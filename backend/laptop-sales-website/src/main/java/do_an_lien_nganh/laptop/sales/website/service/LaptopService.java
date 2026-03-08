package do_an_lien_nganh.laptop.sales.website.service;

import do_an_lien_nganh.laptop.sales.website.dto.laptop.LaptopRequest;
import do_an_lien_nganh.laptop.sales.website.dto.laptop.LaptopResponseDetail;
import do_an_lien_nganh.laptop.sales.website.dto.laptop.LaptopResponseShort;
import do_an_lien_nganh.laptop.sales.website.entity.Laptop;
import org.springframework.data.domain.Page;

import java.util.List;

public interface LaptopService {

    Page<LaptopResponseShort> getFilteredLaptops(
            String keyword, int page, int size, String brand, Long minPrice, Long maxPrice, String sortField, String sortDir);

    Laptop getLaptopById(Long id);
    LaptopResponseDetail create(LaptopRequest request);
    LaptopResponseDetail update(Long id, LaptopRequest request);
    void checkStock(Long laptopId, int newQuantity);
    List<Laptop> get4RecommendedLaptops();
}
