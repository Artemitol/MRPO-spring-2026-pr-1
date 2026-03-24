import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

export function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleBackClick(): void {
    navigate(-1);
  }

  function handleLogoutClick(): void {
    logout();
    navigate('/');
  }

  return (
    <div className="page">
      <header className="header">
        <div className="branding">
          <img src="/logo.svg" alt="Логотип" className="logo" />
          <div>
            <h1>ООО Обувь</h1>
            <p>Система учета товаров и заказов</p>
          </div>
        </div>
        <div className="header-controls">
          <span className="user-name">{user?.fullName}</span>
          <button type="button" onClick={handleBackClick}>
            Назад
          </button>
          <button type="button" onClick={handleLogoutClick}>
            Выход
          </button>
        </div>
      </header>

      <nav className="tabs">
        <Link to="/products">Товары</Link>
        {(user?.role === 'manager' || user?.role === 'admin') && <Link to="/orders">Заказы</Link>}
      </nav>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
