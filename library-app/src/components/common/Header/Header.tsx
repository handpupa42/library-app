const Header = () => {
    return (
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">📚</span>
              <span>Библиотека</span>
            </div>
            <nav className="nav">
              <a href="#">
                📖 Книги
                <span className="nav-badge">10</span>
              </a>
              <a href="#">
                👤 Читатели
                <span className="nav-badge">5</span>
              </a>
            </nav>
          </div>
        </div>
      </header>
    );
  };
  
  export default Header;