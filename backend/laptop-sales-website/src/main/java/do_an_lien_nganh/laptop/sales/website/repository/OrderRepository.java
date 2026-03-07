package do_an_lien_nganh.laptop.sales.website.repository;

import do_an_lien_nganh.laptop.sales.website.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByUserId(String userId);
}
