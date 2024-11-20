import { IoSearch } from "react-icons/io5";

const SearchCustomer = ({search, setSearch})=>{
return(
    <div>
      <div className="search-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="search-box">
            <input className="search-ipt"
            type="search" 
            placeholder="Search Customers..." 
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
export default SearchCustomer;