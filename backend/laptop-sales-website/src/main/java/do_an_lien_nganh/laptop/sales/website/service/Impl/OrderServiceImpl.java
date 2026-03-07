package do_an_lien_nganh.laptop.sales.website.service.Impl;

import do_an_lien_nganh.laptop.sales.website.dto.order.OrderRequest;
import do_an_lien_nganh.laptop.sales.website.dto.order.OrderResponseDetail;
import do_an_lien_nganh.laptop.sales.website.dto.order.OrderResponseShort;
import do_an_lien_nganh.laptop.sales.website.entity.*;
import do_an_lien_nganh.laptop.sales.website.enums.OrderStatus;
import do_an_lien_nganh.laptop.sales.website.mapper.OrderMapper;
import do_an_lien_nganh.laptop.sales.website.repository.OrderRepository;
import do_an_lien_nganh.laptop.sales.website.service.CartService;
import do_an_lien_nganh.laptop.sales.website.service.LaptopService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final LaptopService laptopService;
    private final CouponServiceImpl couponServiceImpl;

    public List<OrderResponseShort> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(OrderMapper::toShortResponse)
                .toList();
    }

    public OrderResponseShort getOrderShort(Long id){
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        return OrderMapper.toShortResponse(order);
    }

    public OrderResponseDetail getOrderDetail(Long id){
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        return OrderMapper.toDetailResponse(order);
    }

    //Lạy chúa
    public OrderResponseDetail createOrderFromCart(Long userId, OrderRequest req) {

        Cart cart = cartService.getById(userId);

        if(cart.getItems().isEmpty()){
            throw new RuntimeException("Cart trống");
        }

        Order order = new Order();

        order.setCustomerName(req.getUserName());
        order.setPhone(req.getNumberPhone());
        order.setAddress(req.getAddress());
        order.setNote(req.getNote());

        order.setStatus(OrderStatus.pending);
        order.setCreatedAt(LocalDate.now());

        List<OrderItem> orderItems = new ArrayList<>();

        long originalPrice = 0;

        for(CartItem cartItem : cart.getItems()){

            Laptop laptop = laptopService.getLaptopById(cartItem.getLaptop().getId());

            int quantity = cartItem.getQuantity();

            // kiểm tra tồn kho
            if(laptop.getRemain() < quantity){
                throw new RuntimeException(laptop.getName() + " không đủ hàng");
            }

            // trừ tồn kho (atomic update tốt hơn)
            laptop.setRemain(laptop.getRemain() - quantity);

            long price = laptop.getPrice();

            OrderItem item = new OrderItem();

            item.setOrder(order);
            item.setLaptopId(laptop.getId());

            // snapshot dữ liệu
            item.setName(laptop.getName());
            item.setImageMain(laptop.getImages().get(0));

            item.setPrice(price);
            item.setQuantity(quantity);

            long itemTotal = price * quantity;

            originalPrice += itemTotal;

            orderItems.add(item);
        }

        order.setItems(orderItems);

        order.setOriginalPrice(originalPrice);

        long discount = 0;

        if(req.getCouponCode() != null){

            Coupon coupon = couponServiceImpl.validateCoupon(
                    req.getCouponCode(),
                    originalPrice
            );

            discount = couponServiceImpl.calculateDiscount(coupon, originalPrice);

            coupon.setUsedCount(coupon.getUsedCount() + 1);

            order.setCouponCode(coupon.getCode());
        }

        order.setDiscount(discount);

        order.setTotalPrice(originalPrice - discount);

        orderRepository.save(order);

        // clear cart
        cart.getItems().clear();

        return OrderMapper.toDetailResponse(order);
    }
}
