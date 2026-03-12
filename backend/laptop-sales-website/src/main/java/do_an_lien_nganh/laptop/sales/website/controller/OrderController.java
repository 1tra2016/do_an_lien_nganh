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
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<OrderResponseShort>> getOrderShort(@PathVariable Long userId) {
        return ResponseEntity.ok(
                ApiResponse.success(orderService.getOrderShort(userId))
        );
    }

    // Lấy chi tiết đơn hàng
    @GetMapping("/{userId}/detail")
    public ResponseEntity<ApiResponse<OrderResponseDetail>> getOrderDetail(@PathVariable Long userId) {
        return ResponseEntity.ok(
                ApiResponse.success(orderService.getOrderDetail(userId))
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
    @PatchMapping("/{userId}")
    public ResponseEntity<ApiResponse<String>> cancelOrder(
            @PathVariable Long userId,
            @RequestParam String reason
    ) {
        orderService.cancelOrder(userId, reason);
        return ResponseEntity.ok(
                ApiResponse.success("Đã hủy thành công")
        );
    }

    @PatchMapping("/{userId}/status")
    public void updateStatus(
            @PathVariable Long userId,
            @RequestParam String status
    ){
        orderService.updateStatus(userId, status);
    }

}