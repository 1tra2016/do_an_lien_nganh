package do_an_lien_nganh.laptop.sales.website.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class DateRange {
    private LocalDateTime start;
    private LocalDateTime end;
}
