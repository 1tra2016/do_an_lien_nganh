import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import Myheader from "./Myheader";
import Footer from "./Footer";

import "../css/DanhmucSanpham.css";

const API_URL = "http://localhost:8080/api/laptops";

const DanhmucSanpham = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const searchQuery = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";

  const [items, setItems] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [sapxep, setSapxep] = useState(null);
  const [giathap, setGiathap] = useState(null);
  const [giacao, setGiacao] = useState(null);
  const [pk, setpk] = useState(null);
  const [brand, setBrand] = useState(null);

  const chonKhoangGia = (thap, cao, pk) => {
    setGiathap(thap);
    setGiacao(cao);
    setpk(pk);
    setPage(0);
  };

  const brands = [
    { label: "Tất cả", value: null },
    { label: "Asus", value: "asus" },
    { label: "HP", value: "hp" },
    { label: "Lenovo", value: "lenovo" },
    { label: "MSI", value: "msi" },
    { label: "Apple", value: "apple" },
    { label: "Dell", value: "dell" },
    { label: "Acer", value: "acer" }
  ];

  const fetchItems = async () => {

    try {

      let sortField = "id";
      let sortDir = "asc";

      if (sapxep === "giatang") {
        sortField = "price";
        sortDir = "asc";
      }

      if (sapxep === "giagiam") {
        sortField = "price";
        sortDir = "desc";
      }

      if (sapxep === "tenAZ") {
        sortField = "name";
        sortDir = "asc";
      }

      if (sapxep === "tenZA") {
        sortField = "name";
        sortDir = "desc";
      }

      const response = await axios.get(API_URL, {
        params: {
          page: page,
          size: 12,
          brand: brand,
          minPrice: giathap,
          maxPrice: giacao === Infinity ? null : giacao,
          sortField: sortField,
          sortDir: sortDir
        }
      });

      const data = response.data.data;

      setItems(data.content);
      setTotalPages(data.totalPages);

    } catch (err) {

      console.error("Error fetching laptops:", err);

    }

  };

  useEffect(() => {

    fetchItems();

  }, [page, brand, giathap, giacao, sapxep]);

  return (

    <div>

      <Myheader />

      <div className="khungmainsp">

        <div className="mainsp">

          {searchQuery && (
            <div style={{ padding: "10px 20px", fontSize: "16px" }}>
              Kết quả tìm kiếm cho: <strong>"{searchQuery}"</strong>
            </div>
          )}

          {/* Filter brand */}
          <div className="locphankhuc">
            <div className="textlpk"><i className="fas fa-tag"></i> Thương hiệu:</div>
            {brands.map((b) => (
              <button
                key={b.label}
                onClick={() => setBrand(b.value)}
                className={brand === b.value ? "phankhuc select" : "phankhuc"}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Lọc theo khoảng giá */}
          <div className="locphankhuc">
            <div className="textlpk"><i className="fas fa-money-bill-wave"></i> Khoảng giá:</div>
            <button onClick={() => chonKhoangGia(null, null, "pk0")} className={pk === "pk0" || pk === null ? "phankhuc" : "phankhuc"}>Tất cả</button>
            <button onClick={() => chonKhoangGia(5000000, 10000000, "pk1")} className={pk === "pk1" ? "phankhuc select" : "phankhuc"}>5 - 10 triệu</button>
            <button onClick={() => chonKhoangGia(10000000, 20000000, "pk2")} className={pk === "pk2" ? "phankhuc select" : "phankhuc"}>10 - 20 triệu</button>
            <button onClick={() => chonKhoangGia(20000000, 30000000, "pk3")} className={pk === "pk3" ? "phankhuc select" : "phankhuc"}>20 - 30 triệu</button>
            <button onClick={() => chonKhoangGia(30000000, 50000000, "pk4")} className={pk === "pk4" ? "phankhuc select" : "phankhuc"}>30 - 50 triệu</button>
            <button onClick={() => chonKhoangGia(50000000, Infinity, "pk5")} className={pk === "pk5" ? "phankhuc select" : "phankhuc"}>Trên 50 triệu</button>
          </div>

          {/* Sắp xếp */}
          <div className="locphankhuc">
            <div className="textlpk"><i className="fas fa-sort"></i> Sắp xếp:</div>
            <button onClick={() => setSapxep("giatang")} className={sapxep === "giatang" ? "phankhuc select" : "phankhuc"}>
              <i className="fas fa-sort-amount-up"></i> Giá tăng dần
            </button>
            <button onClick={() => setSapxep("giagiam")} className={sapxep === "giagiam" ? "phankhuc select" : "phankhuc"}>
              <i className="fas fa-sort-amount-down"></i> Giá giảm dần
            </button>
            <button onClick={() => setSapxep("tenAZ")} className={sapxep === "tenAZ" ? "phankhuc select" : "phankhuc"}>
              <i className="fas fa-sort-alpha-down"></i> Tên A - Z
            </button>
            <button onClick={() => setSapxep("tenZA")} className={sapxep === "tenZA" ? "phankhuc select" : "phankhuc"}>
              <i className="fas fa-sort-alpha-down-alt"></i> Tên Z - A
            </button>
          </div>

          {/* Hiển thị bộ lọc đang áp dụng */}
          {(brand || pk || sapxep) && (
            <div className="active-filters">
              <span className="active-filters-label">Đang lọc:</span>
              {brand && (
                <span className="filter-tag">
                  {brands.find(b => b.value === brand)?.label}
                  <button onClick={() => setBrand(null)}>×</button>
                </span>
              )}
              {pk && pk !== "pk0" && (
                <span className="filter-tag">
                  {giathap && giacao !== Infinity
                    ? `${(giathap / 1000000).toFixed(0)} - ${(giacao / 1000000).toFixed(0)} triệu`
                    : `Trên ${(giathap / 1000000).toFixed(0)} triệu`}
                  <button onClick={() => chonKhoangGia(null, null, null)}>×</button>
                </span>
              )}
              {sapxep && (
                <span className="filter-tag">
                  {sapxep === "giatang" ? "Giá tăng" : sapxep === "giagiam" ? "Giá giảm" : sapxep === "tenAZ" ? "A → Z" : "Z → A"}
                  <button onClick={() => setSapxep(null)}>×</button>
                </span>
              )}
              <button className="clear-all-btn" onClick={() => { setBrand(null); setGiathap(null); setGiacao(null); setpk(null); setSapxep(null); }}>
                <i className="fas fa-times"></i> Xóa tất cả
              </button>
            </div>
          )}

          {/* LIST */}
          <ul className="laptop-list">

            {items.map((item) => (

              <li key={item.id} className="sptt">

                <a href={`/ChitietSanpham/${item.id}`}>

                  <div className="img">
                    <img src={item.imageMain} alt={item.name} />
                  </div>

                  <div className="title">

                    <h4>{item.name}</h4>

                    <p>{item.price.toLocaleString("vi-VN")}₫</p>

                  </div>

                </a>

              </li>

            ))}
          </ul>

          {/* Pagination */}

          <div className="pagination">

            {Array.from({ length: totalPages }).map((_, i) => (

              <button
                key={i}
                onClick={() => setPage(i)}
                className={page === i ? "active" : ""}
                style={{
        padding: "10px 18px",
        fontSize: "16px",
        minWidth: "44px",
        margin: "4px",
        borderRadius: "6px",
        cursor: "pointer"
      }}

              >
                {i + 1}
              </button>

            ))}

          </div>

        </div>

      </div>

      <Footer />

    </div>

  );

};

export default DanhmucSanpham;