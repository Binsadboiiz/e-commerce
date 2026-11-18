import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { vietnamAddressApi } from "@/shared/services/vietnamAddressApi";
import styles from "./VietnamAddressSelector.module.css";

/**
 * 3-Level Linked Dropdown for Vietnam Administrative Divisions
 * (Province/City -> District/Town -> Ward/Commune)
 * Powered by https://provinces.open-api.vn/
 *
 * @param {Object} props
 * @param {string} props.city - Current selected Province/City name
 * @param {string} props.district - Current selected District name
 * @param {string} props.ward - Current selected Ward name
 * @param {Function} props.onChange - Callback `({ city, district, ward }) => void`
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.required=true]
 */
export default function VietnamAddressSelector({
    city = "",
    district = "",
    ward = "",
    onChange,
    disabled = false,
    required = true,
    labels = {
        city: "Tỉnh / Thành phố",
        district: "Quận / Huyện",
        ward: "Phường / Xã"
    }
}) {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
    const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
    const [selectedWardCode, setSelectedWardCode] = useState("");

    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    // Initial load: fetch provinces list
    useEffect(() => {
        let isMounted = true;
        setLoadingProvinces(true);

        vietnamAddressApi.getProvinces()
            .then((list) => {
                if (isMounted) {
                    setProvinces(list);
                }
            })
            .catch((err) => {
                console.error("Failed to load provinces:", err);
            })
            .finally(() => {
                if (isMounted) setLoadingProvinces(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Sync external `city` prop to `selectedProvinceCode` and load districts
    useEffect(() => {
        if (!provinces.length) return;

        if (!city) {
            setSelectedProvinceCode("");
            setDistricts([]);
            return;
        }

        const match = provinces.find((p) => p.name === city);
        if (match) {
            const pCode = String(match.code);
            setSelectedProvinceCode(pCode);

            setLoadingDistricts(true);
            vietnamAddressApi.getDistrictsByProvince(pCode)
                .then((dList) => {
                    setDistricts(dList);
                })
                .catch((err) => {
                    console.error("Failed to load districts:", err);
                })
                .finally(() => {
                    setLoadingDistricts(false);
                });
        }
    }, [city, provinces]);

    // Sync external `district` prop to `selectedDistrictCode` and load wards
    useEffect(() => {
        if (!districts.length) return;

        if (!district) {
            setSelectedDistrictCode("");
            setWards([]);
            return;
        }

        const match = districts.find((d) => d.name === district);
        if (match) {
            const dCode = String(match.code);
            setSelectedDistrictCode(dCode);

            setLoadingWards(true);
            vietnamAddressApi.getWardsByDistrict(dCode)
                .then((wList) => {
                    setWards(wList);
                })
                .catch((err) => {
                    console.error("Failed to load wards:", err);
                })
                .finally(() => {
                    setLoadingWards(false);
                });
        }
    }, [district, districts]);

    // Sync external `ward` prop to `selectedWardCode`
    useEffect(() => {
        if (!wards.length) return;

        if (!ward) {
            setSelectedWardCode("");
            return;
        }

        const match = wards.find((w) => w.name === ward);
        if (match) {
            setSelectedWardCode(String(match.code));
        }
    }, [ward, wards]);

    // Handle user selecting a Province/City
    const handleProvinceChange = async (e) => {
        const pCode = e.target.value;
        setSelectedProvinceCode(pCode);
        setSelectedDistrictCode("");
        setSelectedWardCode("");
        setDistricts([]);
        setWards([]);

        const provinceObj = provinces.find((p) => String(p.code) === pCode);
        const newCityName = provinceObj ? provinceObj.name : "";

        if (onChange) {
            onChange({
                city: newCityName,
                district: "",
                ward: ""
            });
        }

        if (pCode) {
            setLoadingDistricts(true);
            try {
                const dList = await vietnamAddressApi.getDistrictsByProvince(pCode);
                setDistricts(dList);
            } catch (err) {
                console.error("Failed to load districts:", err);
            } finally {
                setLoadingDistricts(false);
            }
        }
    };

    // Handle user selecting a District/Town
    const handleDistrictChange = async (e) => {
        const dCode = e.target.value;
        setSelectedDistrictCode(dCode);
        setSelectedWardCode("");
        setWards([]);

        const districtObj = districts.find((d) => String(d.code) === dCode);
        const newDistrictName = districtObj ? districtObj.name : "";

        if (onChange) {
            onChange({
                city,
                district: newDistrictName,
                ward: ""
            });
        }

        if (dCode) {
            setLoadingWards(true);
            try {
                const wList = await vietnamAddressApi.getWardsByDistrict(dCode);
                setWards(wList);
            } catch (err) {
                console.error("Failed to load wards:", err);
            } finally {
                setLoadingWards(false);
            }
        }
    };

    // Handle user selecting a Ward/Commune
    const handleWardChange = (e) => {
        const wCode = e.target.value;
        setSelectedWardCode(wCode);

        const wardObj = wards.find((w) => String(w.code) === wCode);
        const newWardName = wardObj ? wardObj.name : "";

        if (onChange) {
            onChange({
                city,
                district,
                ward: newWardName
            });
        }
    };

    return (
        <div className={styles.container}>
            {/* 1. Tỉnh / Thành phố */}
            <div className={styles.formGroup}>
                <label className={styles.label}>
                    {labels.city} {required && <span className={styles.required}>*</span>}
                </label>
                <div className={styles.selectWrapper}>
                    <select
                        className={styles.select}
                        value={selectedProvinceCode}
                        onChange={handleProvinceChange}
                        disabled={disabled || loadingProvinces}
                        required={required}
                    >
                        <option value="">
                            {loadingProvinces ? "-- Đang tải tỉnh/thành... --" : "-- Chọn Tỉnh / Thành --"}
                        </option>
                        {provinces.map((p) => (
                            <option key={p.code} value={p.code}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    {loadingProvinces ? (
                        <div className={styles.spinner} />
                    ) : (
                        <ChevronDown size={16} className={styles.arrowIcon} />
                    )}
                </div>
            </div>

            {/* 2. Quận / Huyện */}
            <div className={styles.formGroup}>
                <label className={styles.label}>
                    {labels.district} {required && <span className={styles.required}>*</span>}
                </label>
                <div className={styles.selectWrapper}>
                    <select
                        className={styles.select}
                        value={selectedDistrictCode}
                        onChange={handleDistrictChange}
                        disabled={disabled || !selectedProvinceCode || loadingDistricts}
                        required={required}
                    >
                        <option value="">
                            {loadingDistricts
                                ? "-- Đang tải quận/huyện... --"
                                : !selectedProvinceCode
                                ? "-- Chọn Tỉnh/Thành trước --"
                                : "-- Chọn Quận / Huyện --"}
                        </option>
                        {districts.map((d) => (
                            <option key={d.code} value={d.code}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                    {loadingDistricts ? (
                        <div className={styles.spinner} />
                    ) : (
                        <ChevronDown size={16} className={styles.arrowIcon} />
                    )}
                </div>
            </div>

            {/* 3. Phường / Xã */}
            <div className={styles.formGroup}>
                <label className={styles.label}>
                    {labels.ward} {required && <span className={styles.required}>*</span>}
                </label>
                <div className={styles.selectWrapper}>
                    <select
                        className={styles.select}
                        value={selectedWardCode}
                        onChange={handleWardChange}
                        disabled={disabled || !selectedDistrictCode || loadingWards}
                        required={required}
                    >
                        <option value="">
                            {loadingWards
                                ? "-- Đang tải phường/xã... --"
                                : !selectedDistrictCode
                                ? "-- Chọn Quận/Huyện trước --"
                                : "-- Chọn Phường / Xã --"}
                        </option>
                        {wards.map((w) => (
                            <option key={w.code} value={w.code}>
                                {w.name}
                            </option>
                        ))}
                    </select>
                    {loadingWards ? (
                        <div className={styles.spinner} />
                    ) : (
                        <ChevronDown size={16} className={styles.arrowIcon} />
                    )}
                </div>
            </div>
        </div>
    );
}
