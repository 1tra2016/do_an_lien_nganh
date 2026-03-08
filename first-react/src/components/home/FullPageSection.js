import React, { useEffect, useState } from "react";
import axios from "axios";
import Recommend4Laptops from "./Recommend4Laptops";

const laptopAPI = axios.create({
    baseURL: "http://localhost:8080/api/laptops",
    headers: { "Content-Type": "application/json" },
});


const FullPageSection = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await laptopAPI.get("/recommend");
            setItems(res.data.data || res.data);
        } catch (err) {
            console.error("Error fetching recommend laptops:", err);
        }
    };

    return (
        <div className="fulltrang">
            <div className="head">
                <div className="trang">
                    <div className="trai">
                        <div className="trai1">
                            <div>
                                <img alt="" src="./images/phi.png" />
                            </div>
                        </div>
                        <div className="trai2">
                            <div className="trai2-1">
                                <img alt="" src="./images/tainghe.png" />
                                <div className="txttrai2-1">
                                    <a href="">
                                        Tai nghe Belkin SoundForm Mini AUD002btPK for Kids
                                    </a>
                                </div>
                                <div className="gia">
                                    <img alt="" src="./images/gia1-1.png" />
                                </div>
                            </div>
                            <div className="trai2-2">
                                <img alt="" src="./images/tainghe1.png" />
                                <div className="txttrai2-2">
                                    <a href="">
                                        Tai nghe Belkin SoundForm Play AUC005btPK True Wireless{" "}
                                    </a>
                                </div>
                                <div className="gia2">
                                    <img alt="" src="./images/gia1-2.png" />
                                </div>
                            </div>
                        </div>
                        <div className="trai3">
                            <div className="trai3-1">
                                <img alt="" src="./images/tainghe2.png" />
                                <div className="txttrai3-1">
                                    <a href="">Tai nghe Fnatic REACT+ | 7.1 Virtual Surround USB</a>
                                </div>
                                <div className="gia3">
                                    <img alt="" src="./images/gia1-3.png" />
                                </div>
                            </div>
                            <div className="trai3-2">
                                <img alt="" src="./images/tainghe3.png" />
                                <div className="txttrai3-2">
                                    <a href="">Tai nghe không dây Logitech G733 Lightspeed</a>
                                </div>
                                <div className="gia4">
                                    <img alt="" src="./images/gia1-4.png" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="giua">
                        <div className="giua1">
                            <div>
                                <img alt="" src="./images/phi1.png" />
                            </div>
                        </div>
                        <div className="giua2">
                            <img alt="" src="./images/loa.png" />
                            <a href="">Loa không dây di động Sony SRS-XB13</a>
                            <div className="gialoa">
                                <img alt="" src="./images/gialoa.png" />
                            </div>
                            <div className="tuychon">
                                <a href="">Tùy chọn</a>
                            </div>
                        </div>
                    </div>
                    <div className="phai">
                        <div className="phai1">
                            <div>
                                <img alt="" src="./images/phi2.png" />
                            </div>
                        </div>
                        <div className="phai2">
                            <div className="phai2-1">
                                <img alt="" src="./images/tainghe4.png" />
                                <a href="">Tai nghe Corsair Virtuoso Pro</a>
                                <div className="gia5">
                                    <img alt="" src="./images/gia1-1.png" />
                                </div>
                            </div>
                            <div className="phai2-2">
                                <img alt="" src="./images/tainghe5.png" />
                                <a href="">Tai nghe Edifier W830BT</a>
                                <div className="gia6">
                                    <img alt="" src="./images/gia1-2.png" />
                                </div>
                            </div>
                        </div>
                        <div className="phai3">
                            <div className="phai3-1">
                                <img alt="" src="./images/tainghe6.png" />
                                <div className="txtphai3-1">
                                    <a href="">Tai nghe không dây SENNHEISER Momentum 4 </a>
                                </div>
                                <div className="gia7">
                                    <img alt="" src="./images/gia1-3.png" />
                                </div>
                            </div>
                            <div className="phai3-2">
                                <img alt="" src="./images/tainghe8.png" />
                                <div className="txtphai3-2">
                                    <a href="">
                                        Tai nghe Razer Barracuda X PUBG: Battlegrounds Edition
                                    </a>
                                </div>
                                <div className="gia8">
                                    <img alt="" src="./images/gia1-4.png" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ngang">
                    <div className="textphai">
                        <a href="">Siêu giảm giá - dành riêng cho bạn</a>
                    </div>
                    <div className="ke" />
                    <div className="xemthem">
                        <a href="">{`Xem thêm > `}</a>
                    </div>
                </div>
                <Recommend4Laptops/>
                <div className="quangcao">
                    <img src="./images/quangcao.png" />
                </div>
            </div>
        </div>
    );
};

export default FullPageSection;
