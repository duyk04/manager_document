"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export const ViewDonViModal = () => {
    const [donvi, setDonVi] = useState<any[]>([]);
    useEffect(() => {
        const fetchDonVi = async () => {
            try {
                const response = await axios.get("/api/donvi");
                setDonVi(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDonVi();
    }, []);
    return (
        <div>

            <div>
                {donvi && donvi.map((donvi: any, id) => (
                    <div key={id} className="border border-gray-300 p-2 m-2">
                        <p>{donvi.tenDonVi}</p>
                        <p>{donvi.maDonVi}</p>
                        <p>{donvi.diaChi}</p>
                        <p>{donvi.sdt}</p>
                        <p>{donvi.email}</p>
                        <p>{donvi.website}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}