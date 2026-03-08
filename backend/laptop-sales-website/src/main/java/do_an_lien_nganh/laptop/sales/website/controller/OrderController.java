package do_an_lien_nganh.laptop.sales.website.controller;

import do_an_lien_nganh.laptop.sales.website.dto.ApiResponse;
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
@CrossOrigin(origins = "*") // Cho phép React gọi API từ domain khác
public class OrderController {

    private final OrderServiceImpl orderService;

    // Lấy tất cả đơn hàng
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponseShort>>> getAllOrders() {
        return ResponseEntity.ok(
                ApiResponse.success(orderService.getAllOrders())
        );
    }

    // Lấy tất cả đơn hàng theo người dùng
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<OrderResponseShort>>> getAllOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(
                ApiResponse.success(orderService.getAllOrders(userId)));
    }

    // Lấy thông tin đơn hàng dạng short
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponseShort>> getOrderShort(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success(orderService.getOrderShort(id))
        );
    }

    // Lấy chi tiết đơn hàng
    @GetMapping("/{id}/detail")
    public ResponseEntity<ApiResponse<OrderResponseDetail>> getOrderDetail(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success(orderService.getOrderDetail(id))
        );
    }

    // Tạo đơn hàng từ cart
    @PostMapping("/{userId}")
    public ResponseEntity<ApiResponse<OrderResponseDetail>> createOrder(
            @PathVariable Long userId,
            @RequestBody OrderRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(orderService.createOrderFromCart(userId, request))
        );
    }

    // đổi trạng thái order sang hủy + lí do
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> cancelOrder(
            @PathVariable Long id,
            @RequestParam String reason
    ) {
        orderService.cancelOrder(id, reason);
        return ResponseEntity.ok(
                ApiResponse.success("Đã hủy thành công")
        );
    }

    @PatchMapping("/{id}/status")
    public void updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ){
        orderService.updateStatus(id, status);
    }

}