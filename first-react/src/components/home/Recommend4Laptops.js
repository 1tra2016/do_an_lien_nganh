import React, { useEffect, useState } from "react";
import axios from "axios";
import { userAPI } from "../../APIs/APIs";

const laptopAPI = axios.create({
  baseURL: "http://localhost:8080/api/laptops",
  headers: { "Content-Type": "application/json" }
});

const Recommend4Laptops = () => {

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {

      const response = await laptopAPI.get("/recommend");

      setItems(response.data?.data || []);

    } catch (err) {
      console.error("Error fetching recommended laptops:", err);
    }
  };

  const addToCart = async (e, itemId) => {

    e.preventDefault();
    e.stopPropagation();

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Bạn chưa đăng nhập! Vui lòng đăng nhập để mua hàng.");
      return;
    }

    const currentUser = JSON.parse(storedUser);

    try {

      const response = await userAPI.get(`/${currentUser.id}`);

      const currentCart = response.data.cart || [];

      const itemIndex = currentCart.findIndex(c => c.id === itemId);

      if (itemIndex !== -1) {
        currentCart[itemIndex].number += 1;
      } else {
        currentCart.push({ id: itemId, number: 1 });
      }

      await userAPI.patch(`/${currentUser.id}`, { cart: currentCart });

      const itemData = items.find(i => i.id === itemId);

      if (itemData && itemData.remain > 0) {
        await laptopAPI.patch(`/${itemId}`, {
          remain: itemData.remain - 1
        });
      }

      const updatedUser = {
        ...currentUser,
        cart: currentCart
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      window.dispatchEvent(new Event("cartUpdated"));

      alert("✅ Thêm vào giỏ hàng thành công!");

      fetchItems();

    } catch (err) {

      console.error("Error adding to cart:", err);

      alert("Đã xảy ra lỗi khi thêm vào giỏ hàng!");

    }
  };

  return (

    <div className="">

      <div className="binhtong2-1">

        {items.map((item) => {

          const image =
            item.images && item.images.length > 0
              ? item.images[0]
              : "/no-image.png";

          return (

            <div
              className="boxbinhtong2-1"
              title={item.name}
              key={item.id}
            >

              <a href={`/ChitietSanpham/${item.id}`}>

                <div className="binh1">
                  <img src={image} alt={item.name} />
                </div>

                <div className="txt1boxbinhtong2-1">
                  {item.name}
                </div>

                <div className="boxbinhdanhgia">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i}>
                      <i className="fa-regular fa-star"></i>
                    </div>
                  ))}
                  <div className="txtboxbinhdanhgia">
                    0 đánh giá
                  </div>
                </div>

                <div className="boxbinhgia">
                  <div className="boxbinhgia1">
                    <div className="txt1boxbinhgia1">
                      {item.price.toLocaleString("vi-VN")}₫
                    </div>
                  </div>
                </div>

                <div className="txtduoiradio">
                  Còn {item.remain} sản phẩm
                </div>

                <div className="borderboxbinhtong2-1"></div>

              </a>

              <div
                className="binhtuychon1"
                onClick={(e) => addToCart(e, item.id)}
                style={{ cursor: "pointer" }}
              >

                <div className="txtbinhtuychon1">
                  Thêm vào giỏ
                </div>

              </div>

            </div>

          );
        })}

      </div>

    </div>

  );

};

export default Recommend4Laptops;