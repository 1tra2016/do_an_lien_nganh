import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { itemAPI, userAPI } from '../../APIs/APIs';
import Recommend4Laptops from './Recommend4Laptops';

const laptopAPI = axios.create({
    baseURL: 'http://localhost:8080/api/laptops',
    headers: { "Content-Type": "application/json" },
});

const SuggestionSection = () => {
    const [items, setItems] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await laptopAPI.get("/recommend");
            setItems(response.data.data || response.data);
        } catch (err) {
            console.error("Error fetching items:", err);
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

            // Giảm tồn kho
            const itemData = items.find(i => i.id === itemId);
            if (itemData && itemData.remain > 0) {
                await itemAPI.patch(`/${itemId}`, { remain: itemData.remain - 1 });
            }

            // Cập nhật localStorage
            const updatedUser = { ...currentUser, cart: currentCart };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            window.dispatchEvent(new Event("cartUpdated"));

            alert("✅ Thêm vào giỏ hàng thành công!");
            fetchItems(); // Refresh lại dữ liệu
        } catch (err) {
            console.error("Error adding to cart:", err);
            alert("Đã xảy ra lỗi khi thêm vào giỏ hàng!");
        }
    };

    return (
        <div className="binhtongtiep1">
            <div className="binhtong5">
                <div className="binhspbanchay1">
                    <a href="/DanhmucSanpham">
                        <div className="txtbinhspbanchay1">Gợi ý hôm nay</div>
                    </a>
                </div>
                <div className="binhspbanchay2">
                    <a href="/DanhmucSanpham">
                        <div className="txtbinhspbanchay3">● Máy chơi game</div>
                    </a>
                </div>
                <div className="binhspbanchay3">
                    <a href="/DanhmucSanpham">
                        <div className="txtbinhspbanchay2">● Máy tính laptop</div>
                    </a>
                </div>
                <div className="binhspbanchay3">
                    <a href="/DanhmucSanpham">
                        <div className="txtbinhspbanchay3">● Tai nghe</div>
                    </a>
                </div>
                <div className="binhspbanchay4">
                    <a href="/DanhmucSanpham">
                        <div className="txtbinhspbanchay4">{`Xem thêm >`}</div>
                    </a>
                </div>
            </div>
            <Recommend4Laptops/>
        </div>
    );
};

export default SuggestionSection;
