package do_an_lien_nganh.laptop.sales.website.service.Impl;

import do_an_lien_nganh.laptop.sales.website.entity.Brand;
import do_an_lien_nganh.laptop.sales.website.exception.ResourceNotFoundException;
import do_an_lien_nganh.laptop.sales.website.repository.BrandRepository;
import do_an_lien_nganh.laptop.sales.website.repository.LaptopRepository;
import do_an_lien_nganh.laptop.sales.website.service.BrandService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class BrandServiceImpl implements BrandService {
    private final BrandRepository  brandRepository;
    private final LaptopRepository laptopRepository;

    @Override
    public Brand findById(Integer id){
        return brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
    }

    @Override
    public List<Brand> findAll(){
        return brandRepository.findAll();
    }

    @Override
    public Brand createBrand(Brand req){
       return brandRepository.save(req);
    }

    @Override
    public Brand  updateBrand(Integer id, Brand req){
        Brand brand = findById(id);
        brand.setName(req.getName());
        brand.setDescription(req.getDescription());
        return brandRepository.save(brand);
    }

    @Override
    public void deleteBrand(Integer id){
        boolean exists = laptopRepository.existsByBrandId(id);

        if (exists) {
            System.out.println("Không xóa");
            throw new RuntimeException("Không thể xóa hãng vì còn sản phẩm!");
        }

        brandRepository.deleteById(id);
    }
}
