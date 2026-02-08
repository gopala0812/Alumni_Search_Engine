package com.alumni.backend;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/alumni")
@CrossOrigin(origins = "*")
public class AlumniController {

    @Autowired
    private AlumniRepository alumniRepository;
    @Autowired
private AnnouncementRepository announcementRepository;


    /* ---------------- HEALTH ---------------- */
    @GetMapping("/health")
    public String health() {
        return "Alumni Search Engine Backend Active 🚀";
    }

    /* ---------------- SEARCH ---------------- */
    @GetMapping("/search")
    public List<Map<String, Object>> search(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String company
    ) {
        List<Alumni> alumniList = alumniRepository.findAll();
        List<Map<String, Object>> results = new ArrayList<>();

        for (Alumni a : alumniList) {
            boolean match = true;

            if (id != null && !a.getId().equals(id)) match = false;
            if (name != null && !a.getName().toLowerCase().contains(name.toLowerCase())) match = false;
            if (department != null && !a.getDepartment().toLowerCase().contains(department.toLowerCase())) match = false;
            if (year != null && a.getYear() != year) match = false;
            if (location != null && !a.getAddress().toLowerCase().contains(location.toLowerCase())) match = false;
            if (company != null && !a.getCompany().toLowerCase().contains(company.toLowerCase())) match = false;

            if (match) results.add(formatAlumni(a));
        }
        return results;
    }

    /* ---------------- ADD ---------------- */
    @PostMapping("/add")
    public Map<String, String> add(@RequestBody Alumni alumni) {
        alumniRepository.save(alumni);
        return Map.of("Status", "Success");
    }

    /* ---------------- ADD BULK ---------------- */
    @PostMapping("/add-bulk")
    public Map<String, String> addBulk(@RequestBody List<Alumni> list) {
        alumniRepository.saveAll(list);
        return Map.of("Status", "Success");
    }

    /* ---------------- DOWNLOAD ---------------- */
    @GetMapping("/download")
    public List<Map<String, Object>> download(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) Integer batch
    ) {
        List<Alumni> list = alumniRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Alumni a : list) {
            if (id != null && a.getId().equals(id)) {
                result.add(formatAlumni(a));
            } else if (batch != null && a.getYear() == batch) {
                result.add(formatAlumni(a));
            }
        }
        return result;
    }


    @Autowired
private EmailService emailService;

@PostMapping("/send-announcement")
public Map<String, Object> sendAnnouncement(
        @RequestBody AnnouncementRequest req
) {

    List<Alumni> list = alumniRepository.findAll();
    int count = 0;

    for (Alumni a : list) {

        if (req.getYear() != null && a.getYear() != req.getYear())
            continue;

        if (req.getDepartment() != null &&
            !a.getDepartment().toLowerCase()
             .contains(req.getDepartment().toLowerCase()))
            continue;

        if (req.getLocation() != null &&
            !a.getAddress().toLowerCase()
             .contains(req.getLocation().toLowerCase()))
            continue;

        if (req.getCompany() != null &&
            !a.getCompany().toLowerCase()
             .contains(req.getCompany().toLowerCase()))
            continue;

        if (a.getEmail() != null && !a.getEmail().isEmpty()) {
            emailService.sendMail(
                a.getEmail(),
                req.getSubject(),
                req.getMessage()
            );
            count++;
        }
    }

    // ✅ SAVE ANNOUNCEMENT INTO DATABASE
    Announcement ann = new Announcement();
    ann.setSubject(req.getSubject());
    ann.setMessage(req.getMessage());
    ann.setYear(req.getYear());
    ann.setDepartment(req.getDepartment());
    ann.setLocation(req.getLocation());
    ann.setCompany(req.getCompany());
    ann.setSentAt(java.time.LocalDateTime.now());

    announcementRepository.save(ann);

    return Map.of(
        "status", "success",
        "mailsSent", count
    );
}

    /* ---------------- HELPER ---------------- */
    private Map<String, Object> formatAlumni(Alumni a) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("ID", a.getId());
        m.put("Name", a.getName());
        m.put("Department", a.getDepartment());
        m.put("Year", a.getYear());
        m.put("Email", a.getEmail());
        m.put("Phone", a.getPhone());
        m.put("Address", a.getAddress());
        m.put("Job", a.getJob());
        m.put("Company", a.getCompany());
        m.put("CGPA", a.getCgpa());
        return m;
    }
}
