package do_an_lien_nganh.laptop.sales.website.dto.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenueByDate {

    private String date;
    private long revenue;
    private long orders;

}