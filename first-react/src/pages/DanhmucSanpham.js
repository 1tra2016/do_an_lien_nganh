import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Myheader from "./Myheader";
import Footer from "./Footer";

import "../css/DanhmucSanpham.css";

const API_URL = "http://localhost:8080/api/laptops";

const DanhmucSanpham = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const keyword = searchParams.get("keyword") || "";

  const [items, setItems] = useState([]);
  const [brands, setBrands] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [sapxep, setSapxep] = useState(null);
  const [giathap, setGiathap] = useState(null);
  const [giacao, setGiacao] = useState(null);
  const [pk, setpk] = useState(null);
  const [brandId, setBrandId] = useState(null);

  // ✅ FIX: thêm lại hàm bị thiếu
  const chonKhoangGia = (min, max, key) => {
    setPage(0);
    setGiathap(min);
    setGiacao(max);
    setpk(key);
  };

  const clearSearch = () => {
    navigate('/DanhmucSanpham');
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/brands");
      setBrands(res.data.data);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  const fetchItems = async () => {
    try {

      const sortMap = {
        giatang: { field: "price", dir: "asc" },
        giagiam: { field: "price", dir: "desc" },
        tenAZ: { field: "name", dir: "asc" },
        tenZA: { field: "name", dir: "desc" }
      };

      const sort = sortMap[sapxep] || { field: "id", dir: "asc" };

      const res = await axios.get(API_URL, {
        params: {
          keyword,
          page,
          size: 12,
          brandId,
          minPrice: giathap,
          maxPrice: giacao === Infinity ? null : giacao,
          sortField: sort.field,
          sortDir: sort.dir
        }
      });

      const data = res.data.data;

      setItems(data.content);
      setTotalPages(data.totalPages);

    } catch (err) {
      console.error("Error fetching laptops:", err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [keyword, page, brandId, giathap, giacao, sapxep]);

  return (

    <div>

      <Myheader />

      <div className="khungmainsp">
          <div className = "fixed">
            
            {/* BRAND */}
            <div className="locphankhuc">
              <div className="textlpk"><i className="fas fa-tag"></i> Thương hiệu:</div>

              <button
                onClick={() => { setBrandId(null); setPage(0); }}
                className={brandId === null ? "phankhuc select" : "phankhuc"}
              >
                Tất cả
              </button>

              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => { setBrandId(b.id); setPage(0); }}
                  className={brandId === b.id ? "phankhuc select" : "phankhuc"}
                >
                  {b.name}
                </button>
              ))}
            </div>

            {/* PRICE */}
            <div className="locphankhuc">
              <div className="textlpk"><i className="fas fa-money-bill-wave"></i> Khoảng giá:</div>

              <button onClick={() => chonKhoangGia(null, null, "pk0")} className={pk === "pk0" || pk === null ? "phankhuc" : "phankhuc"}>
                Tất cả
              </button>
              <button onClick={() => chonKhoangGia(5000000, 10000000, "pk1")} className={pk === "pk1" ? "phankhuc select" : "phankhuc"}>
                5 - 10 triệu
              </button>
              <button onClick={() => chonKhoangGia(10000000, 20000000, "pk2")} className={pk === "pk2" ? "phankhuc select" : "phankhuc"}>
                10 - 20 triệu
              </button>
              <button onClick={() => chonKhoangGia(20000000, 30000000, "pk3")} className={pk === "pk3" ? "phankhuc select" : "phankhuc"}>
                20 - 30 triệu
              </button>
              <button onClick={() => chonKhoangGia(30000000, 50000000, "pk4")} className={pk === "pk4" ? "phankhuc select" : "phankhuc"}>
                30 - 50 triệu
              </button>
              <button onClick={() => chonKhoangGia(50000000, Infinity, "pk5")} className={pk === "pk5" ? "phankhuc select" : "phankhuc"}>
                Trên 50 triệu
              </button>
            </div>

            {/* SORT */}
            <div className="locphankhuc">
              <div className="textlpk"><i className="fas fa-sort"></i> Sắp xếp:</div>

              <button onClick={() => setSapxep("giatang")} className={sapxep === "giatang" ? "phankhuc select" : "phankhuc"}>
                Giá tăng dần
              </button>

              <button onClick={() => setSapxep("giagiam")} className={sapxep === "giagiam" ? "phankhuc select" : "phankhuc"}>
                Giá giảm dần
              </button>

              <button onClick={() => setSapxep("tenAZ")} className={sapxep === "tenAZ" ? "phankhuc select" : "phankhuc"}>
                Tên A - Z
              </button>

              <button onClick={() => setSapxep("tenZA")} className={sapxep === "tenZA" ? "phankhuc select" : "phankhuc"}>
                Tên Z - A
              </button>
            </div>
            {/* ACTIVE FILTER */}
          {(brandId || pk || sapxep || keyword) && (
            <div className="active-filters">

              <span className="active-filters-label">Đang lọc:</span>

              {keyword && (
                <span className="filter-tag">
                  Tìm kiếm: "{keyword}"
                  <button onClick={clearSearch}>×</button>
                </span>
              )}

              {brandId && (
                <span className="filter-tag">
                  {brands.find(b => b.id === brandId)?.name}
                  <button onClick={() => setBrandId(null)}>×</button>
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
                  {sapxep === "giatang" ? "Giá tăng dần" :
                   sapxep === "giagiam" ? "Giá giảm dần" :
                   sapxep === "tenAZ" ? "Tên A-Z" :
                   sapxep === "tenZA" ? "Tên Z-A" : sapxep}
                  <button onClick={() => setSapxep(null)}>×</button>
                </span>
              )}

              <button className="clear-all-btn" onClick={() => {
                setBrandId(null);
                setGiathap(null);
                setGiacao(null);
                setpk(null);
                setSapxep(null);
                if (keyword) {
                  clearSearch();
                }
              }}>
                Xóa tất cả
              </button>

            </div>
          )}
          </div>
          

          
        <div className="mainsp">

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

          {/* PAGINATION */}
          <div className="pagination">

            {Array.from({ length: totalPages }).map((_, i) => (

              <button
                key={i}
                onClick={() => setPage(i)}
                className={page === i ? "boxso active" : "boxso"}
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