package do_an_lien_nganh.laptop.sales.website.service;

import do_an_lien_nganh.laptop.sales.website.entity.Brand;
import do_an_lien_nganh.laptop.sales.website.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BrandService {
    Brand findById(Integer id);
    List<Brand> findAll();
    Brand createBrand(Brand req);
    Brand  updateBrand(Integer id, Brand req);
    void deleteBrand(Integer id);
}
