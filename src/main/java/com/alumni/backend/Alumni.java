package com.alumni.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Alumni {

    @Id
    private Long id;

    private String name;
    private String department;
    private int year;
    private String email;
    private String phone;
    private String address;
    private String job;
    private String company;
    private double cgpa;

    public Alumni() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getJob() { return job; }
    public void setJob(String job) { this.job = job; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public double getCgpa() { return cgpa; }
    public void setCgpa(double cgpa) { this.cgpa = cgpa; }
}
