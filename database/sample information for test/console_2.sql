select * from coupons;
INSERT INTO users (email, name, number_phone, password, address, role)
VALUES
    ('admin@gmail.com', 'Admin', '0900000001', '123456', 'Ha Noi', 'admin'),
    ('user1@gmail.com', 'Nguyen Van A', '0900000002', '123456', 'Ha Noi', 'user'),
    ('user2@gmail.com', 'Tran Van B', '0900000003', '123456', 'Ho Chi Minh', 'user');

INSERT INTO users (id, address, email, name, number_phone, password, role) VALUES
                                                                        (10, 'Ha Noi', 'user3@gmail.com', 'Le Van C', '0900000006', '123456', 'user'),
                                                                        (11, 'Da Nang', 'user4@gmail.com', 'Pham Thi D', '0900000004', '123456', 'user'),
                                                                        (12, 'Ho Chi Minh', 'user5@gmail.com', 'Hoang Van E', '0900000005', '123456', 'user');

select * from users;
select * from laptops;
INSERT INTO laptops
(name, price, monthly, remain, company, cpu, ram, drive, card, screen, camera, port, weight, pin, system)
VALUES
    (
        'Apple MacBook Air M2 13.6 inch 2023',
        27990000,
        2330000,
        20,
        'Apple',
        'Apple M2 8-core CPU',
        '8GB',
        '256GB SSD',
        'Apple Integrated GPU',
        '13.6" Liquid Retina 2560x1664',
        '1080p FaceTime HD',
        '2x Thunderbolt / USB 4, 3.5mm headphone jack, MagSafe 3',
        '1.24 kg',
        '52.6 Wh',
        'macOS'
    ),

    (
        'Dell XPS 13 9315',
        32990000,
        2750000,
        15,
        'Dell',
        'Intel Core i7-1250U',
        '16GB LPDDR5',
        '512GB SSD',
        'Intel Iris Xe Graphics',
        '13.4" FHD+ 1920x1200',
        '720p HD',
        '2x Thunderbolt 4 USB-C, headphone adapter',
        '1.17 kg',
        '51 Wh',
        'Windows 11'
    ),

    (
        'ASUS ROG Zephyrus G14 2023',
        42990000,
        3580000,
        10,
        'ASUS',
        'AMD Ryzen 9 7940HS',
        '16GB DDR5',
        '1TB SSD',
        'NVIDIA RTX 4060 8GB',
        '14" QHD+ 165Hz',
        '1080p',
        'USB-C, USB-A, HDMI 2.1, microSD, 3.5mm',
        '1.65 kg',
        '76 Wh',
        'Windows 11'
    ),

    (
        'Lenovo ThinkPad X1 Carbon Gen 11',
        39990000,
        3330000,
        12,
        'Lenovo',
        'Intel Core i7-1365U',
        '16GB LPDDR5',
        '1TB SSD',
        'Intel Iris Xe',
        '14" WUXGA 1920x1200',
        '1080p IR camera',
        '2x Thunderbolt 4, 2x USB-A, HDMI, 3.5mm',
        '1.12 kg',
        '57 Wh',
        'Windows 11 Pro'
    ),

    (
        'HP Spectre x360 14',
        36990000,
        3080000,
        8,
        'HP',
        'Intel Core i7-1355U',
        '16GB LPDDR4x',
        '1TB SSD',
        'Intel Iris Xe',
        '13.5" 3K2K OLED',
        '5MP webcam',
        'Thunderbolt 4, USB-A, microSD, 3.5mm',
        '1.34 kg',
        '66 Wh',
        'Windows 11'
    ),

    (
        'Acer Swift X 14',
        31990000,
        2660000,
        14,
        'Acer',
        'Intel Core i7-13700H',
        '16GB LPDDR5',
        '1TB SSD',
        'NVIDIA RTX 4050',
        '14.5" 2.8K OLED',
        '1080p',
        'USB-C Thunderbolt 4, HDMI 2.1, USB-A, 3.5mm',
        '1.55 kg',
        '76 Wh',
        'Windows 11'
    ),

    (
        'MSI Katana 15 B13V',
        30990000,
        2580000,
        18,
        'MSI',
        'Intel Core i7-13620H',
        '16GB DDR5',
        '1TB SSD',
        'NVIDIA RTX 4060',
        '15.6" FHD 144Hz',
        '720p HD',
        'USB-C, USB-A, HDMI, RJ-45, 3.5mm',
        '2.25 kg',
        '53.5 Wh',
        'Windows 11'
    ),

    (
        'ASUS Zenbook 14 OLED UX3402',
        25990000,
        2160000,
        25,
        'ASUS',
        'Intel Core i5-1340P',
        '16GB LPDDR5',
        '512GB SSD',
        'Intel Iris Xe',
        '14" 2.8K OLED',
        '1080p',
        '2x Thunderbolt 4, USB-A, HDMI 2.1, 3.5mm',
        '1.39 kg',
        '75 Wh',
        'Windows 11'
    ),

    (
        'Lenovo Legion 5 Pro 16',
        37990000,
        3160000,
        9,
        'Lenovo',
        'AMD Ryzen 7 7745HX',
        '16GB DDR5',
        '1TB SSD',
        'NVIDIA RTX 4060',
        '16" WQXGA 165Hz',
        '1080p',
        'USB-C, USB-A, HDMI 2.1, RJ-45, 3.5mm',
        '2.45 kg',
        '80 Wh',
        'Windows 11'
    ),

    (
        'Dell Inspiron 15 3520',
        15990000,
        1330000,
        30,
        'Dell',
        'Intel Core i5-1235U',
        '8GB DDR4',
        '512GB SSD',
        'Intel Iris Xe',
        '15.6" FHD',
        '720p HD',
        'USB-A, USB-C, HDMI, SD card reader, 3.5mm',
        '1.83 kg',
        '41 Wh',
        'Windows 11'
    );

INSERT INTO laptop_images (laptop_id, image_url) VALUES
-- Laptop 5
(5, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8'),
(5, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853'),
(5, 'https://images.unsplash.com/photo-1518770660439-4636190af475'),

-- Laptop 6
(6, 'https://images.unsplash.com/photo-1509395176047-4a66953fd231'),
(6, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef'),
(6, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2'),

-- Laptop 7
(7, 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2'),
(7, 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f'),
(7, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'),

-- Laptop 8
(8, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c'),
(8, 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f'),
(8, 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308'),

-- Laptop 9
(9, 'https://images.unsplash.com/photo-1504707748692-419802cf939d'),
(9, 'https://images.unsplash.com/photo-1522199710521-72d69614c702'),
(9, 'https://images.unsplash.com/photo-1492724441997-5dc865305da7'),

-- Laptop 10
(10, 'https://images.unsplash.com/photo-1517331156700-3c241d2b4d83'),
(10, 'https://images.unsplash.com/photo-1487014679447-9f8336841d58'),
(10, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c'),

-- Laptop 11
(11, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf'),
(11, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'),
(11, 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d'),

-- Laptop 12
(12, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'),
(12, 'https://images.unsplash.com/photo-1492724441997-5dc865305da7'),
(12, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8'),

-- Laptop 13
(13, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef'),
(13, 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308'),
(13, 'https://images.unsplash.com/photo-1522199710521-72d69614c702'),

-- Laptop 14
(14, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'),
(14, 'https://images.unsplash.com/photo-1518770660439-4636190af475'),
(14, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c');

select * from orders;
INSERT INTO orders
(id, address, note, coupon_code, created_at, customer_name, discount, phone, total_price, status, user_id)
VALUES
    (20, 'Ha Noi', '', NULL, '2026-03-01', 'Le Van C', 0, '0900000003', 65980000, 'delivered', 10),

    (21, 'Da Nang', '', NULL, '2026-03-02', 'Pham Thi D', 0, '0900000004', 32990000, 'shipping', 11),

    (22, 'Ho Chi Minh', '', NULL, '2026-03-03', 'Hoang Van E', 0, '0900000005', 19490000, 'pending', 12),

    (23, 'Ha Noi', '', NULL, '2026-03-04', 'Le Van C', 0, '0900000003', 52480000, 'delivered', 10),

    (24, 'Da Nang', '', NULL, '2026-03-05', 'Pham Thi D', 0, '0900000004', 32990000, 'confirmed', 11);

update orders set original_price = total_price;
select * from order_items;
INSERT INTO order_items
(order_id, laptop_id, name, price, quantity, image_main)
VALUES
    (20, 6, 'Dell XPS 13 9315', 32990000, 1, 'xps13.png'),
    (20, 5, 'MacBook Air M2', 32990000, 1, 'macbookair.png'),
    (21, 6, 'Dell XPS 13 9315', 32990000, 1, 'xps13.png'),
    (22, 3, 'Asus Vivobook', 19490000, 1, 'vivobook.png'),
    (23, 5, 'MacBook Air M2', 32990000, 1, 'macbookair.png'),
    (23, 3, 'Asus Vivobook', 19490000, 1, 'vivobook.png'),
    (24, 9, 'HP Spectre x360', 32990000, 1, 'spectre.png'),
    (24, 6, 'Dell XPS 13 9315', 32990000, 1, 'xps13.png'),
    (23, 6, 'Dell XPS 13 9315', 32990000, 1, 'xps13.png'),
    (20, 3, 'Asus Vivobook', 19490000, 1, 'vivobook.png');