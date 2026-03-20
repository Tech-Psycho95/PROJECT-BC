import React, { useState } from 'react';
import '../styles/login.css';

const Login = () => {
  const initialSignUp = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('signup') === 'true';
  const [isSignUp, setIsSignUp] = useState(initialSignUp);

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirm, setSignUpConfirm] = useState('');

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateLogin = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUp = () => {
    const newErrors = {};
    if (!signUpName.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!signUpEmail.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signUpEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!signUpPassword) {
      newErrors.password = 'Password is required';
    } else {
      if (signUpPassword.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/\d/.test(signUpPassword)) {
        newErrors.password = 'Password must contain at least 1 number';
      } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(signUpPassword)) {
        newErrors.password = 'Password must contain at least 1 special character';
      }
    }
    if (!signUpConfirm) {
      newErrors.confirm = 'Please confirm your password';
    } else if (signUpPassword !== signUpConfirm) {
      newErrors.confirm = 'Passwords do not match';
      alert('Passwords do not match');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('token', 'authenticated');
      window.location.href = '/onboarding';
    }, 1500);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!validateSignUp()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('token', 'authenticated');
      window.location.href = '/onboarding';
    }, 1500);
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      {/* STRIDE branding above the card */}
      <div className="login-branding">
        <h1 className="login-stride-logo">STRIDE</h1>
        <p className="login-stride-slogan">YOUR career UPTO speed</p>
      </div>

      <div className="login-card">
        <div className="login-header">
          <h2>{isSignUp ? 'CREATE ACCOUNT' : 'AUTHENTICATE'}</h2>
          <p>{isSignUp ? 'Fill in your details to get started.' : 'Enter your credentials to continue.'}</p>
        </div>

        {!isSignUp ? (
          /* ---- LOGIN FORM ---- */
          <form onSubmit={handleLogin} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                placeholder="name@example.com"
                className={errors.email ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                placeholder="••••••••"
                className={errors.password ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : 'Login'}
            </button>
          </form>
        ) : (
          /* ---- SIGN UP FORM ---- */
          <form onSubmit={handleSignUp} noValidate>
            <div className="form-group">
              <label htmlFor="su-name">Full Name</label>
              <input
                type="text"
                id="su-name"
                value={signUpName}
                onChange={(e) => {
                  setSignUpName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
                placeholder="John Doe"
                className={errors.name ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="su-email">Email</label>
              <input
                type="email"
                id="su-email"
                value={signUpEmail}
                onChange={(e) => {
                  setSignUpEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                placeholder="name@example.com"
                className={errors.email ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="su-password">Password</label>
              <input
                type="password"
                id="su-password"
                value={signUpPassword}
                onChange={(e) => {
                  setSignUpPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                placeholder="••••••••"
                className={errors.password ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
              <div className="password-guidelines">
                Min 8 characters • 1 number • 1 special character
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="su-confirm">Confirm Password</label>
              <input
                type="password"
                id="su-confirm"
                value={signUpConfirm}
                onChange={(e) => {
                  setSignUpConfirm(e.target.value);
                  if (errors.confirm) setErrors({ ...errors, confirm: null });
                }}
                placeholder="••••••••"
                className={errors.confirm ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.confirm && <div className="error-message">{errors.confirm}</div>}
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : 'Sign Up'}
            </button>
          </form>
        )}

        <div className="login-switch">
          <button className="switch-btn" onClick={switchMode} type="button">
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
