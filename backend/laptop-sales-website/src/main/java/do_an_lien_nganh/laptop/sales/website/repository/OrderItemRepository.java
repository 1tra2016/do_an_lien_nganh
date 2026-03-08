package do_an_lien_nganh.laptop.sales.website.repository;

import do_an_lien_nganh.laptop.sales.website.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);

    @Query("""
    SELECT oi.name, SUM(oi.quantity)
    FROM OrderItem oi
    WHERE oi.order.status = do_an_lien_nganh.laptop.sales.website.enums.OrderStatus.delivered
    GROUP BY oi.name
    ORDER BY SUM(oi.quantity) DESC
""")
    List<Object[]> getTopSellingProducts();
}
