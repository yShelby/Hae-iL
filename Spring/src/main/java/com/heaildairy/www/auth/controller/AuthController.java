package com.heaildairy.www.auth.controller;

import com.heaildairy.www.auth.dto.AuthDTO;
import com.heaildairy.www.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // accessing different ports(5173 vs 8080)
public class AuthController {

    private final AuthService authService; //Declares OrderService field

    @PostMapping("/diary/form")
    public ResponseEntity<String> save(@Valid @RequestBody AuthDTO dto){
        authService.save(dto);
        return ResponseEntity.ok("Authority");
    }
}
