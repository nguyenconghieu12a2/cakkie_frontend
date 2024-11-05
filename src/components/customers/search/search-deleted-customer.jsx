import { IoIosSearch } from "react-icons/io";

const SearchDeletedCustomer = ({searchDeleted, setSearchDeleted})=>{
    return(<div>
        <div className="search-container">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="search-box">
            <input className="search-ipt"
            type="search" 
            placeholder="Search Customers..." 
            role="searchBox"
            value={searchDeleted}
            onChange={(e) => setSearchDeleted(e.target.value)}
          />
          <IoIosSearch className="search-icon"/>
          </div>
          </form>
        </div>
      </div>);
    }
    export default SearchDeletedCustomer;