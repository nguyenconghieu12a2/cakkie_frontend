import { IoSearch } from "react-icons/io5";

const SearchOOSProduct = ({search, setSearch})=>{
return(
    <div>
      <div className="search-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="search-box">
            <input className="search-ipt"
            type="search" 
            placeholder="Search Products..." 
            role="searchBox"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IoSearch  className="search-icon"/>
          </div>
        </form>
      </div>
    </div>
  );
}
export default SearchOOSProduct;