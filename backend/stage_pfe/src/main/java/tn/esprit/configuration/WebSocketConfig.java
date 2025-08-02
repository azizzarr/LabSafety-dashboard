package tn.esprit.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        //this is the endpoint where our client will connect to our backend (server)
        registry.addEndpoint("/stomp-endpoint")
                .withSockJS();
    }
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        //The message will be sent to the broker, so that this broker can send the data back to the client
        //The client will be listening to that particular broker, to th particular topic that we have created
        //Like this, we will be getting the data back

        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app"); //this is the prefix for our application
        //whenever we need to register to enable the broker, we have to type this path: /app/topic

    }
}
