package do_an_lien_nganh.laptop.sales.website.repository;

import do_an_lien_nganh.laptop.sales.website.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndLaptopId(Long CartId, Long laptopId);
    Optional<CartItem> findOptionalByCartIdAndLaptopId(Long CartId, Long laptopId);
}
