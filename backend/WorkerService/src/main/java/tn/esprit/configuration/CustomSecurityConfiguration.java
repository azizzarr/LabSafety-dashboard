/*package tn.esprit.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@Order(2)
public class CustomSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests().anyRequest().permitAll();
    }


/*
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // Disable security checks to allow access to the resource
        http.csrf().disable()
                .authorizeRequests()
                .antMatchers("/Post").permitAll();
    }


}*/

