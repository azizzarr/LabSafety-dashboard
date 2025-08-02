package tn.esprit.security.JwtFilter;

import lombok.RequiredArgsConstructor;
import org.apache.http.HttpHeaders;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tn.esprit.security.jwtUtils.JwtUtils;


import javax.servlet.FilterChain;
import javax.servlet.ServletException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;


@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {


    private final UserDetailsService userDetailsService;


    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {


        //get authorization Header and validate it
        final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if(!(header != null && header != "" && header.startsWith("Bearer "))){
            filterChain.doFilter(request,response);
            return;
        }

        final String token = header.split(" ")[1].trim();

        // get user identity and find the user in the database
        UserDetails userDetails = userDetailsService.loadUserByUsername(jwtUtils.getUsernameFromToken(token));


        //validate token
        if(!jwtUtils.validateToken(token, userDetails)){
            filterChain.doFilter(request, response);

            return;
        }

        UsernamePasswordAuthenticationToken
                authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request, response);




    }





}