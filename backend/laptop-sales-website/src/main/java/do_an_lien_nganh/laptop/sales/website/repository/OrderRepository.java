package do_an_lien_nganh.laptop.sales.website.repository;

import do_an_lien_nganh.laptop.sales.website.entity.Order;
import do_an_lien_nganh.laptop.sales.website.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByUserId(String userId);
    List<Order> findByUserId(Long userId);
    long countByStatus(OrderStatus status);
    List<Order> findAllByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("""
    SELECT SUM(oi.quantity)
    FROM OrderItem oi
    WHERE oi.order.status = :status
      AND (:start IS NULL OR oi.order.createdAt >= :start)
      AND (:end IS NULL OR oi.order.createdAt < :end)
""")
    Long getTotalProductsSold(
            @Param("status") OrderStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
