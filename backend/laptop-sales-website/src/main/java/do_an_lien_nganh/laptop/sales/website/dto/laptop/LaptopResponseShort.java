package do_an_lien_nganh.laptop.sales.website.dto.laptop;

import do_an_lien_nganh.laptop.sales.website.entity.Brand;
import lombok.Data;

@Data
public class LaptopResponseShort {

    private Long id;
    private String name;
    private Long price;
    private Integer remain;
    private Brand brand;

    private String imageMain;
}
