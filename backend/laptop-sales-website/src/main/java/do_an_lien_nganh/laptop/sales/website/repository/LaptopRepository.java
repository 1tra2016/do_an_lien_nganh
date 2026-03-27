package do_an_lien_nganh.laptop.sales.website.repository;

import do_an_lien_nganh.laptop.sales.website.entity.Laptop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LaptopRepository extends JpaRepository<Laptop, Long>, JpaSpecificationExecutor<Laptop> {
    // Tìm kiếm laptop theo tên (cho tính năng search)
    List<Laptop> findByNameContainingIgnoreCase(String name);

    //Không viết các chức năng lọc khác ở đây
    //Lọc đa lớp sẽ do Service đảm nhận nhờ gọi đến repository có chứa JpaSpecificationExecutor

    @Query(value = "SELECT * FROM laptops WHERE remain > 0 ORDER BY RANDOM() LIMIT 4", nativeQuery = true)
    List<Laptop> get4RandomLaptops();

    boolean existsByBrandId(Integer id);
}