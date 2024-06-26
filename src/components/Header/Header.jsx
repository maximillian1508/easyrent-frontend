import { Link, NavLink, useLocation } from 'react-router-dom';
import './Header.css';
import { useEffect, useRef, useState } from 'react';

function Header() {
  const location = useLocation();
  const [iconSrc, setIconSrc] = useState('images/er-horizontal-white.svg');
  const ref = useRef();

    useEffect(() => {
      if (location.pathname === '/') {
        const handleScroll = () => {
          if (ref.current) {
            const scrollTop = window.scrollY;
            const offset = 50;

            if (scrollTop > offset) {
              ref.current.classList.add('whitebar');
              setIconSrc('images/er-horizontal.svg');
            } else {
              ref.current.classList.remove('whitebar');
              setIconSrc('images/er-horizontal-white.svg');
            }
          }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }

      return () => {};
    }, [location.pathname]);

    const content = (
      <header className={location.pathname === '/' ? 'topbar' : 'topbar whitebar static'} ref={ref}>
        <aside className="logo-sect">
          <Link to="/"><img src={location.pathname === '/' ? iconSrc : 'images/er-horizontal.svg'} alt="Easyrent" /></Link>
        </aside>
        <nav className="nav-section">
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/listing">Listing</NavLink>
            </li>
            <li>
              <NavLink to="/faq">FAQ</NavLink>
            </li>
            <li>
              <NavLink to="/contacts">Contacts</NavLink>
            </li>
          </ul>
        </nav>
        <nav className="nav-section">
          <ul>
            <li>
              <NavLink to="/login">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/register">
                Register
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

    );
    return content;
}
export default Header;
