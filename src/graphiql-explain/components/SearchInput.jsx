import styles from './SearchInput.module.css'
import { ReactComponent as SearchIcon } from '../../icons/search.svg'

export const SearchInput = ({ onChange, placeholder }) => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchIcon}>
        <SearchIcon />
      </div>
      <input
        className={styles.searchInput}
        type="text"
        onChange={onChange}
        name="searchPath"
        required
        placeholder={placeholder}
      />
    </div>
  )
}
