package do_an_lien_nganh.laptop.sales.website.controller;

import do_an_lien_nganh.laptop.sales.website.dto.order.OrderRequest;
import do_an_lien_nganh.laptop.sales.website.dto.order.OrderResponseDetail;
import do_an_lien_nganh.laptop.sales.website.dto.order.OrderResponseShort;
import do_an_lien_nganh.laptop.sales.website.service.Impl.OrderServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderServiceImpl orderService;

    // Lấy tất cả đơn hàng
    @GetMapping
    public ResponseEntity<List<OrderResponseShort>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Lấy thông tin đơn hàng dạng short
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseShort> getOrderShort(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderShort(id));
    }

    // Lấy chi tiết đơn hàng
    @GetMapping("/{id}/detail")
    public ResponseEntity<OrderResponseDetail> getOrderDetail(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderDetail(id));
    }

    // Tạo đơn hàng từ cart
    @PostMapping("/{userId}")
    public ResponseEntity<OrderResponseDetail> createOrder(
            @PathVariable Long userId,
            @RequestBody OrderRequest request
    ) {
        return ResponseEntity.ok(orderService.createOrderFromCart(userId, request));
    }
}