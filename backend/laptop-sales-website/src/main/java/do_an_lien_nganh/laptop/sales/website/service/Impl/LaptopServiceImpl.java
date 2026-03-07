package do_an_lien_nganh.laptop.sales.website.service.Impl;

import do_an_lien_nganh.laptop.sales.website.dto.laptop.LaptopRequest;
import do_an_lien_nganh.laptop.sales.website.dto.laptop.LaptopResponseDetail;
import do_an_lien_nganh.laptop.sales.website.entity.Laptop;
import do_an_lien_nganh.laptop.sales.website.exception.ResourceNotFoundException;
import do_an_lien_nganh.laptop.sales.website.mapper.LaptopMapper;
import do_an_lien_nganh.laptop.sales.website.repository.LaptopRepository;
import do_an_lien_nganh.laptop.sales.website.service.LaptopService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LaptopServiceImpl implements LaptopService {

    private final LaptopRepository laptopRepository;

    @Override
     // Lấy danh sách Laptop với bộ lọc đa lớp
    public List<Laptop> getFilteredLaptops(String brand, Long minPrice, Long maxPrice, String sortField, String sortDir) {

        // Khởi tạo bộ lọc động
        Specification<Laptop> spec = (root, query, cb) -> cb.conjunction();

        // 1. Lọc theo hãng
        if (brand != null && !brand.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(cb.lower(root.get("company")), brand.toLowerCase()));
        }

        // 2. Lọc theo khoảng giá
        if (minPrice != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        }

        // 3. Xử lý sắp xếp (Tên A-Z, Z-A hoặc Giá tăng/giảm)
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortField);

        return laptopRepository.findAll(spec, sort);
    }

    @Override
    public Laptop getLaptopById(Long id) {
        return laptopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy laptop ID: " + id));
    }

    @Override
    public LaptopResponseDetail create(LaptopRequest request) {
        Laptop laptop = LaptopMapper.toEntity(request);
        return LaptopMapper.toLaptopResponseDetail(laptopRepository.save(laptop));
    }

    @Override
    public LaptopResponseDetail update(Long id, LaptopRequest request) {

        Laptop laptop = laptopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laptop not found"));
        LaptopMapper.updateEntity(laptop,request);

        return LaptopMapper.toLaptopResponseDetail(laptopRepository.save(laptop));
    }

    @Override
    public void checkStock(Long id, int quantity){
        Laptop laptop = laptopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laptop not found"));

        if(laptop.getRemain() < quantity)
            throw new ResourceNotFoundException("Not enough stock");
    }
}