package do_an_lien_nganh.laptop.sales.website.repository;

import do_an_lien_nganh.laptop.sales.website.dto.statistic.TopProduct;
import do_an_lien_nganh.laptop.sales.website.entity.OrderItem;
import do_an_lien_nganh.laptop.sales.website.enums.OrderStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);

    @Query("""
    SELECT SUM(oi.quantity)
    FROM OrderItem oi
    WHERE oi.order.status = :status
      AND oi.order.createdAt >= :start
      AND oi.order.createdAt < :end
""")
    Long getTotalProductsSold(
            @Param("status") OrderStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
    SELECT new do_an_lien_nganh.laptop.sales.website.dto.statistic.TopProduct(
        oi.name,
        SUM(oi.quantity),
        SUM(oi.price * oi.quantity)
    )
    FROM OrderItem oi
    WHERE oi.order.status = :status
      AND oi.order.createdAt >= :start
      AND oi.order.createdAt < :end
    GROUP BY oi.name
    ORDER BY SUM(oi.quantity) DESC, SUM(oi.price * oi.quantity) DESC
""")
    List<TopProduct> getTopSellingProducts(
            @Param("status") OrderStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );
}
