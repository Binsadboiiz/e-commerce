import styles from "./SearchBar.module.css"
import { FaCaretDown, FaSearch } from "react-icons/fa";

function SearchBar() {
    return (
        <form className={styles.searchBar}>
            
            <button type="button" className={styles.filter}>
                <span>All</span>
                <FaCaretDown/>
            </button>

            <input 
                type="text"
                placeholder=""
                className={styles.input} 
            />
            
            <button 
                type="submit"
                className={styles.button}>
                
                <FaSearch />
            </button>
        </form>
    )
}

export default SearchBar