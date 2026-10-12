/**
 * Service to interact with the Vietnam Administrative Boundaries API
 * Docs: https://provinces.open-api.vn/
 */
const BASE_URL = "https://provinces.open-api.vn/api";

// Cache in-memory to prevent duplicate requests across component re-renders
let provincesCache = null;
const districtsCache = new Map();
const wardsCache = new Map();

export const vietnamAddressApi = {
    /**
     * Fetch all provinces/cities in Vietnam
     * @returns {Promise<Array<{code: number, name: string, division_type: string, codename: string, phone_code: number}>>}
     */
    async getProvinces() {
        if (provincesCache && provincesCache.length > 0) {
            return provincesCache;
        }

        try {
            const res = await fetch(`${BASE_URL}/p/`);
            if (!res.ok) {
                throw new Error(`Failed to fetch provinces: ${res.statusText}`);
            }
            const data = await res.json();
            provincesCache = data;
            return data;
        } catch (error) {
            console.error("[vietnamAddressApi] Error fetching provinces:", error);
            throw error;
        }
    },

    /**
     * Fetch districts by province code with depth=2
     * @param {number|string} provinceCode 
     * @returns {Promise<Array<{code: number, name: string, division_type: string, codename: string, province_code: number}>>}
     */
    async getDistrictsByProvince(provinceCode) {
        if (!provinceCode) return [];
        const key = String(provinceCode);
        if (districtsCache.has(key)) {
            return districtsCache.get(key);
        }

        try {
            const res = await fetch(`${BASE_URL}/p/${provinceCode}?depth=2`);
            if (!res.ok) {
                throw new Error(`Failed to fetch districts: ${res.statusText}`);
            }
            const data = await res.json();
            const districts = data?.districts || [];
            districtsCache.set(key, districts);
            return districts;
        } catch (error) {
            console.error(`[vietnamAddressApi] Error fetching districts for province ${provinceCode}:`, error);
            throw error;
        }
    },

    /**
     * Fetch wards by district code with depth=2
     * @param {number|string} districtCode 
     * @returns {Promise<Array<{code: number, name: string, division_type: string, codename: string, district_code: number}>>}
     */
    async getWardsByDistrict(districtCode) {
        if (!districtCode) return [];
        const key = String(districtCode);
        if (wardsCache.has(key)) {
            return wardsCache.get(key);
        }

        try {
            const res = await fetch(`${BASE_URL}/d/${districtCode}?depth=2`);
            if (!res.ok) {
                throw new Error(`Failed to fetch wards: ${res.statusText}`);
            }
            const data = await res.json();
            const wards = data?.wards || [];
            wardsCache.set(key, wards);
            return wards;
        } catch (error) {
            console.error(`[vietnamAddressApi] Error fetching wards for district ${districtCode}:`, error);
            throw error;
        }
    }
};

export default vietnamAddressApi;