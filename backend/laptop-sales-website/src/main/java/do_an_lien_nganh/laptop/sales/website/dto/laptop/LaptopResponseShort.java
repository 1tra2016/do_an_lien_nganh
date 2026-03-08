package do_an_lien_nganh.laptop.sales.website.dto.laptop;

import lombok.Data;

@Data
public class LaptopResponseShort {

    private Long id;
    private String name;
    private Long price;
    private Integer remain;

    private String imageMain;
}
