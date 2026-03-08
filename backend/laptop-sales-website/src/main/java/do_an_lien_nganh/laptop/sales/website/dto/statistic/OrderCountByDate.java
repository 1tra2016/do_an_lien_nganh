package do_an_lien_nganh.laptop.sales.website.dto.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderCountByDate {

    private String date;
    private long orders;

}