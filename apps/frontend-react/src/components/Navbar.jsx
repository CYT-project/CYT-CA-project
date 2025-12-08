import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <div className="navbar-logo">
            <Link to="/" className="navbar-brand">
              MarketForge
            </Link>
          </div>
          <div className="navbar-links">
            <Link to="/marketplace" className="navbar-link navbar-link-active">
              Marketplace
            </Link>
            <Link to="/categories" className="navbar-link">
              Categories
            </Link>
            <Link to="/sellers" className="navbar-link">
              Sellers
            </Link>
          </div>
        </div>        
      </div>
    </nav>
  );
};

export default Navbar;
