import React from "react";

const Login = () => {
  const google = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
          box-sizing: border-box;
          background: radial-gradient(circle at top, #252019 0%, #111111 45%, #080808 100%);
          color: #ffffff;
          font-family: "Montserrat", sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 45px 35px;
          text-align: center;
          background: rgba(25, 25, 25, 0.95);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 18px;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
          box-sizing: border-box;
        }

        .login-logo {
          margin-bottom: 35px;
          font-size: 23px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .login-logo span {
          color: #d4af37;
        }

        .login-icon {
          width: 75px;
          height: 75px;
          margin: 0 auto 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 35px;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 50%;
        }

        .login-card h2 {
          margin: 0 0 12px;
          font-size: 25px;
          font-weight: 700;
        }

        .login-subtitle {
          margin-bottom: 30px;
          color: #aaaaaa;
          font-size: 14px;
          line-height: 1.6;
        }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
          color: #888888;
          font-size: 12px;
        }

        .login-divider::before,
        .login-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #393939;
        }

        .google-login-button {
          width: 100%;
          min-height: 52px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 15px;
          padding: 8px 18px;
          border: 1px solid #dddddd;
          border-radius: 8px;
          background: #ffffff;
          color: #333333;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .google-login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.2);
        }

        .google-icon {
          width: 25px;
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .google-icon img {
          width: 23px;
          height: 23px;
          object-fit: contain;
        }

        .login-footer {
          margin: 28px 0 0;
          color: #888888;
          font-size: 12px;
          line-height: 1.6;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 35px 22px;
          }

          .login-card h2 {
            font-size: 21px;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            CINE<span>GENIE</span>
          </div>

          <div className="login-icon">
            <span role="img" aria-label="Movie clapperboard">🎬</span>
          </div>

          <h2>Welcome to CineGenie</h2>

          <p className="login-subtitle">
            Discover movies you'll love.
          </p>

          <div className="login-divider">
            <span>Sign in to continue</span>
          </div>

          <button
            className="google-login-button"
            onClick={google}
          >
            <span className="google-icon">
              <img
                src="https://pngimg.com/uploads/google/google_PNG19630.png"
                alt="Google"
              />
            </span>

            <span>Continue with Google</span>
          </button>

          <p className="login-footer">
            Your next favorite movie is waiting.
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;