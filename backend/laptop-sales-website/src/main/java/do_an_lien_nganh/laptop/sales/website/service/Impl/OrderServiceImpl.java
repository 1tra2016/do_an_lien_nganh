package do_an_lien_nganh.laptop.sales.website.service.Impl;

import do_an_lien_nganh.laptop.sales.website.dto.order.OrderRequest;
import do_an_lien_nganh.laptop.sales.website.dto.order.OrderResponseDetail;
import do_an_lien_nganh.laptop.sales.website.dto.order.OrderResponseShort;
import do_an_lien_nganh.laptop.sales.website.entity.*;
import do_an_lien_nganh.laptop.sales.website.enums.OrderStatus;
import do_an_lien_nganh.laptop.sales.website.mapper.OrderMapper;
import do_an_lien_nganh.laptop.sales.website.repository.OrderRepository;
import do_an_lien_nganh.laptop.sales.website.repository.LaptopRepository;
import do_an_lien_nganh.laptop.sales.website.service.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final LaptopService laptopService;
    private final LaptopRepository laptopRepository;
    private final UserService userService;
    private final CouponService couponService;


    @Override
    public List<OrderResponseShort> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(OrderMapper::toShortResponse)
                .toList();
    }

    @Override
    public List<OrderResponseShort> getAllOrders(Long userId) {

        List<OrderResponseShort> rep = orderRepository.findByUserId(userId)
                .stream()
                .map(OrderMapper::toShortResponse)
                .toList();
        if  (rep.isEmpty()) throw new RuntimeException("trống");
        return rep;
    }

    @Override
    public OrderResponseShort getOrderShort(Long id){
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        return OrderMapper.toShortResponse(order);
    }

    @Override
    public OrderResponseDetail getOrderDetail(Long id){
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        return OrderMapper.toDetailResponse(order);
    }

    @Override
    public void cancelOrder(Long orderId, String reason){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if(order.getStatus() == OrderStatus.cancelled) throw new RuntimeException("Order already cancelled");

        for(OrderItem item : order.getItems()){
                Laptop laptop = laptopService.getLaptopById(item.getLaptopId());
                laptop.setRemain(laptop.getRemain() + item.getQuantity());
                laptopRepository.save(laptop);
            }

        order.setStatus(OrderStatus.cancelled);
        order.setCancelReason(reason);
    }

    @Override
    public OrderResponseShort updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        OrderStatus newStatus;
        try {newStatus = OrderStatus.valueOf(status);}
        catch (IllegalArgumentException e) {throw new RuntimeException("Trạng thái không hợp lệ");}

        OrderStatus currentStatus = order.getStatus();

        // Không cho sửa nếu đã giao hoặc đã hủy
        if (currentStatus == OrderStatus.delivered || currentStatus == OrderStatus.cancelled) {
            throw new RuntimeException("Không thể thay đổi trạng thái đơn đã hoàn tất hoặc đã hủy");
        }

        // Kiểm tra logic chuyển trạng thái
        switch (currentStatus) {
            case pending -> {
                if (newStatus != OrderStatus.confirmed && newStatus != OrderStatus.cancelled) {
                    throw new RuntimeException("'Chờ xác nhận' chỉ có thể chuyển sang 'Đã xác nhận' hoặc 'Đã hủy'");
                }
            }
            case confirmed -> {
                if (newStatus != OrderStatus.shipping && newStatus != OrderStatus.cancelled) {
                    throw new RuntimeException("'Đã xác nhận' chỉ có thể chuyển sang 'Đang giao' hoặc 'Đã hủy'");
                }
            }
            case shipping -> {
                if (newStatus != OrderStatus.delivered && newStatus != OrderStatus.cancelled) {
                    throw new RuntimeException("'Đang giao' chỉ có thể chuyển sang 'Đã giao' hoặc 'Đã hủy'");
                }
            }
        }

        order.setStatus(newStatus);
        return OrderMapper.toShortResponse(order);
    }

    //Lạy chúa
    @Override
    public OrderResponseDetail createOrderFromCart(Long userId, OrderRequest req) {
        //get cart
        Cart cart = cartService.getById(userId);
        if (cart.getItems().isEmpty()) throw new RuntimeException("Cart trống");

        validateStock(cart);
        //tạo order và orderItem
        Order order = createBaseOrder(req);
        order.setUser(userService.getById(userId));
        List<OrderItem> items = buildOrderItems(cart, order);
        order.setItems(items);

        //lấy giá gốc để tính tiền giảm giá nếu có
        long originalPrice = items.stream()
                .mapToLong(i -> i.getPrice() * i.getQuantity())
                .sum();
        order.setOriginalPrice(originalPrice);
        long discount = applyCoupon(req.getCouponCode(), originalPrice, order);
        order.setDiscount(discount);
        order.setTotalPrice(originalPrice - discount);

        orderRepository.save(order);
        cart.getItems().clear();
        return OrderMapper.toDetailResponse(order);
    }

    private void validateStock(Cart cart){
        for(CartItem cartItem : cart.getItems()){
            Laptop laptop = laptopService.getLaptopById(cartItem.getLaptop().getId());

            if(laptop.getRemain() < cartItem.getQuantity())
                throw new RuntimeException(laptop.getName() + " không đủ hàng");
        }
    }

    private Order createBaseOrder(OrderRequest req){
        //không dùng mapper vì đây là nghiệp vụ tương tác enity
        Order order = new Order();

        order.setCustomerName(req.getUserName());
        order.setPhone(req.getNumberPhone());
        order.setAddress(req.getAddress());
        order.setNote(req.getNote());
        order.setPayment(req.getPayment());
        order.setStatus(OrderStatus.pending);
        order.setCreatedAt(LocalDateTime.now());
        return order;
    }

    private List<OrderItem> buildOrderItems(Cart cart, Order order){
        List<OrderItem> items = new ArrayList<>();
        for(CartItem cartItem : cart.getItems()){
            Laptop laptop = laptopService.getLaptopById(cartItem.getLaptop().getId());

            int quantity = cartItem.getQuantity();
            if(laptop.getRemain() < quantity)throw new RuntimeException(laptop.getName() + " không đủ hàng");
            laptop.setRemain(laptop.getRemain() - quantity);

            OrderItem item = new OrderItem();

            item.setOrder(order);
            item.setLaptopId(laptop.getId());
            item.setName(laptop.getName());

            item.setImageMain(laptop.getImages().get(0));

            item.setPrice(laptop.getPrice());
            item.setQuantity(quantity);
            items.add(item);
        }
        return items;
    }

    private long applyCoupon(String couponCode, long originalPrice, Order order){
        if(couponCode == null) return 0;
        Coupon coupon = couponService.validateCoupon(couponCode, originalPrice);
        long discount = couponService.calculateDiscount(coupon, originalPrice);

        coupon.setUsedCount(coupon.getUsedCount() + 1);
        order.setCouponCode(coupon.getCode());
        return discount;
    }
}
