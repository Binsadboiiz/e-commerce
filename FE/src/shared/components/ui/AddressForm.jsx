import { vietnamAddressApi } from "@/shared/services/vietnamAddressApi";
import React, { useState, useEffect } from "react";

export default function AddressSelectGroup({value, onChange, disabled = false}) {
    const [provinces, setProvince] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [slectedCodes, setSelectedCodes] = useState({
        provinceCode: "",
        districtCode: "",
        wardCode: ""
    });

    const [loading, setLoading] = useState({
        provinces: false,
        districts: false,
        wards: false
    });

    useEffect(() => {
        async function fetchProvinces() {
            setLoading(prev => ({...prev,provinces:true}));
            try {
                const data = await vietnamAddressApi.getProvinces();
                setProvince(data);
            } catch (error) {
                console.log("Error loading: ", error);
            } finally {
                setLoading(prev => ({ ...prev, provinces: false }));
            }
        }
        fetchProvinces();
    }, []);

    const handleProvinceChange = async (e) => {
        const provinceCode = e.target.value;
        const selectedProvince = provinces.find(p => String(p.code) == String(provinceCode));
        const provinceName = selectedProvince ? selectedProvince.name : "";

        setSelectedCodes({
            provinceCode,
            districtCode: "",
            wardCode: ""
        });
        setDistricts([]);
        setWards([]);

        onChange({
            city: provinceName,
            district: "",
            ward: ""
        });

        if(!provinceCode) return;

        setLoading(prev => ({ ...prev, districts: true}));
        try {
            const districtList = await vietnamAddressApi.getDistrictsByProvince(provinceCode);
            setDistricts(districtList);
        } catch(err) {
            console.error("Error to load district: ", err);
        } finally {
            setLoading(prev => ({ ...prev,districts: false}));
        }
    };

    const handleDistrictChange = async (e) => {
        const districtCode = e.target.value;
        const selectedDistrict = districts.find(d => String(d.code) == String(districtCode));
        const districtName = selectedDistrict ? selectedDistrict.name : "";

        setSelectedCodes(prev => ({
            ...prev,
            districtCode,
            wardCode: ""
        }));

        setWards([]);

        onChange({
            city: value.city,
            district: districtName,
            ward: ""
        });

        if(!districtCode) return;

        setLoading(prev => ({...prev, wards: true}));
        try {
            const wardList = await vietnamAddressApi.getWardsByDistrict(districtCode);
            setWards(wardList);
        } catch(err) {
            console.error("Faild to load ward: ", err);
        } finally {
            setLoading(prev => ({ ...prev, wards: false}));
        }
    };

    const handleWardChange = async (e) => {
        const wardCode = e.target.value;
        const selectedWard = wards.find(w => String(w.code) == String(wardCode));
        const wardName = selectedWard ? selectedWard.name : "";

        setSelectedCodes(prev => ({
            ...prev,
            wardCode
        }));
        
        onChange({
            city: value.city,
            district: value.district,
            ward: wardName
        });
    }
}