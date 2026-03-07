package do_an_lien_nganh.laptop.sales.website.dto.laptop;

import lombok.Data;

import java.util.List;

@Data
public class LaptopRequest {

    private String name;
    private Long price;
    private Integer remain;

    private String company;

    private Long monthly;
    private String cpu;
    private String ram;
    private String drive;
    private String card;
    private String screen;
    private String camera;
    private String port;
    private String weight;
    private String pin;
    private String system;

    private List<String> images;
}
