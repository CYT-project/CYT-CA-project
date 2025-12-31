import { Link } from 'react-router-dom';


const HomePage = () => {
  return (
    <div className="homepage">
      <div className="hero">
        <div className="hero-image-wrapper">
          <img
            className="hero-image"
            src="https://media.istockphoto.com/id/2184773448/ru/%D1%84%D0%BE%D1%82%D0%BE/%D1%81%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA-%D1%81%D0%B2%D0%B5%D1%80%D1%85%D1%83-%D0%B1%D0%B8%D0%B7%D0%BD%D0%B5%D1%81-%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D0%B8-%D0%BD%D0%B0-%D1%81%D0%BE%D0%B2%D0%B5%D1%89%D0%B0%D0%BD%D0%B8%D0%B8-%D0%B2-%D0%BE%D1%84%D0%B8%D1%81%D0%B5-%D0%B3%D0%B4%D0%B5-%D0%BE%D0%BD%D0%B8-%D1%81%D0%BE%D0%B2%D0%B5%D1%89%D0%B0%D1%8E%D1%82%D1%81%D1%8F-%D0%B7%D0%B0-%D0%B1%D0%BE%D0%BB%D1%8C%D1%88%D0%B8%D0%BC-%D1%81%D1%82%D0%BE%D0%BB%D0%BE%D0%BC.jpg?s=2048x2048&w=is&k=20&c=KaR-hYZ1YlvTqDuvfLrul_8UnMXsag-2FjpDyhZ46zk="
            alt="Digital assets marketplace"
          />
          <div className="hero-overlay" aria-hidden="true" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Amazing Digital Assets
          </h1>
          <p className="hero-text">
            Find the perfect second or third hand digital assets for your next project. High-quality resources for developers, designers, and creators.\n
            <img src="https://i.chzbgr.com/full/10517816576/hD0171878" alt="Image" /><img src="https://i.chzbgr.com/full/10517816576/hD0171878" alt="Image" />
          </p>
          <div className="hero-actions">
            <Link
              to="/marketplace"
              className="hero-button"
            >
              Browse Marketplace
            
            </Link>
          </div>
        </div>
      </div> 
      <div className="categories-section">
        <h2 className="categories-title">Popular Categories</h2>
        <div className="categories-grid">
          {[
            { name: 'UI Kits', count: '1.2k+ Items', href: '#' },
            { name: 'Icons', count: '5k+ Items', href: '#' },
            { name: 'Templates', count: '2.3k+ Items', href: '#' },
            { name: 'Fonts', count: '500+ Items', href: '#' },
            { name: 'Illustrations', count: '1.8k+ Items', href: '#' },
            { name: '3D Assets', count: '750+ Items', href: '#' },
          ].map((category) => (
            <div key={category.name} className="category-card">
              <div className="category-card-body">
                <div className="category-card-header">
                  <div className="category-icon-wrapper">
                    <div className="category-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                  </div>
                  <div className="category-card-text">
                    <dl>
                      <dt className="category-name">{category.name}</dt>
                      <dd className="category-count-wrapper">
                        <div className="category-count">{category.count}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="category-card-footer">
                <div className="category-card-footer-inner">
                  <a href={category.href} className="category-link">
                    View all
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
