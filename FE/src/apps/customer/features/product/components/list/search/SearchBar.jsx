import { useState } from "react";
import styles from "./SearchBar.module.css";
import { FaCaretDown, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/route.config";

export default function SearchBar({
    placeholder = "Search product...",
    categories = ["All"]
}) {

    const [input, setInput] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const query = input.trim();

        // điều hướng sang trang product list
        navigate(
            query
                ? `${ROUTES.PRODUCTS_LIST}?q=${encodeURIComponent(query)}`
                : ROUTES.PRODUCTS_LIST
        )
    };

    return (
        <form className={styles.searchBar} onSubmit={handleSubmit}>

            <button type="button" className={styles.filter}>
                <span>All</span>
                <FaCaretDown />
            </button>

            <input
                type="text"
                placeholder={placeholder}
                className={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            <button type="submit" className={styles.button}>
                <FaSearch />
            </button>

        </form>
    );
}