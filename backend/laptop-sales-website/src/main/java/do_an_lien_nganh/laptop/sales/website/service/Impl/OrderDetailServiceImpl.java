package do_an_lien_nganh.laptop.sales.website.service.Impl;

import do_an_lien_nganh.laptop.sales.website.dto.order.OrderItemResponse;
import do_an_lien_nganh.laptop.sales.website.entity.OrderItem;
import do_an_lien_nganh.laptop.sales.website.mapper.OrderMapper;
import do_an_lien_nganh.laptop.sales.website.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailServiceImpl {
    private final OrderItemRepository orderItemRepository;

    public List<OrderItemResponse> getItemsByOrder(Long orderId){
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);

        return items.stream()
                .map(OrderMapper::toItemResponse)
                .toList();
    }

}