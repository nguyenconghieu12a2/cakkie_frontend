import { IoIosSearch } from "react-icons/io";

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
          <IoIosSearch className="search-icon"/>
          </div>
        </form>
      </div>
    </div>
  );
}
export default SearchCustomer;