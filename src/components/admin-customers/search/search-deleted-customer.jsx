import { IoSearch } from "react-icons/io5";

const SearchDeletedCustomer = ({ searchDeleted, setSearchDeleted }) => {
  return (
    <div>
      <div className="search-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="search-box flex flex-row justify-center items-center">
            <input
              className="search-ipt"
              type="search"
              placeholder="Search Customers..."
              role="searchBox"
              value={searchDeleted}
              onChange={(e) => setSearchDeleted(e.target.value)}
            />
            <IoSearch className="search-icon" />
          </div>
        </form>
      </div>
    </div>
  );
};
export default SearchDeletedCustomer;
