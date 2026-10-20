
package com.thindi.app.controller;

import com.thindi.app.model.OrderStatusUpdate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class OrderStatusController {

    private final SimpMessagingTemplate messagingTemplate;

    public OrderStatusController(
            SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/order-status")
    public void updateOrderStatus(
            @Payload OrderStatusUpdate update) {

        messagingTemplate.convertAndSend(
                "/topic/orders/" + update.getOrderId(),
                update
        );
    }
}
