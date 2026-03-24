import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAsGuest } = useAuth();
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleLoginChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setLoginValue(event.target.value);
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setPassword(event.target.value);
  }

  function handleLoginClick(): void {
    void handleLogin();
  }

  function handleGuestClick(): void {
    void handleGuest();
  }

  async function handleLogin(): Promise<void> {
    try {
      setErrorMessage('');
      await login(loginValue, password);
      navigate('/products');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Ошибка входа');
    }
  }

  async function handleGuest(): Promise<void> {
    await loginAsGuest();
    navigate('/products');
  }

  return (
    <div className="login-page">
      <section className="login-card">
        <img src="/logo.svg" alt="Логотип" className="logo-big" />
        <h1>Вход в систему ООО Обувь</h1>
        <p>Введите логин и пароль или перейдите в режим гостя.</p>
        <label>
          Логин
          <input value={loginValue} onChange={handleLoginChange} />
        </label>
        <label>
          Пароль
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        {errorMessage && <div className="error-box">{errorMessage}</div>}
        <div className="actions">
          <button type="button" onClick={handleLoginClick}>
            Войти
          </button>
          <button type="button" className="secondary" onClick={handleGuestClick}>
            Войти как гость
          </button>
        </div>
      </section>
    </div>
  );
}
