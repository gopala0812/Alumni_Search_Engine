package com.alumni.backend;

public class AnnouncementRequest {

    private Integer year;
    private String department;
    private String location;
    private String company;

    private String subject;
    private String message;

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
