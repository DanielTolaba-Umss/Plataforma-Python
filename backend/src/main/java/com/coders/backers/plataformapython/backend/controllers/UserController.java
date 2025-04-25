package com.coders.backers.plataformapython.backend.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
public class UserController {


    @GetMapping("/prueba")
    public String prueba(){
        return "Hola Puerca!!!";
    }

}
