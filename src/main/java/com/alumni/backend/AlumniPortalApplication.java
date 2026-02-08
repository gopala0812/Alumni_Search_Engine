package com.alumni.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;


@SpringBootApplication
@EnableAsync
public class AlumniPortalApplication {

	public static void main(String[] args) {
		SpringApplication.run(AlumniPortalApplication.class, args);
	}

}
