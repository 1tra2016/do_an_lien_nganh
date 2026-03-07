package do_an_lien_nganh.laptop.sales.website.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "laptops")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Laptop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // id số tự tăng
    private Long id;

    @Column(columnDefinition = "TEXT") // bởi vì có thể sẽ dài hơn Varchar255 nên để text
    private String name;
    private Long price;
    private Long monthly;
    private Integer remain;

    private String company;

    private String cpu;
    private String ram;
    private String drive;
    private String card;
    private String screen;
    private String camera;

    @Column(columnDefinition = "TEXT")
    private String port;

    private String weight;
    private String pin;
    private String system;

    @ElementCollection
    @CollectionTable(name = "laptop_images", joinColumns = @JoinColumn(name = "laptop_id"))
    @Column(name = "image_url")
    private List<String> images;
}