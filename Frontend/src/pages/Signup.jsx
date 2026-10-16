import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({ name, email, password });
      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Signup failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brandMark} aria-hidden="true">
          <span style={styles.brandIcon}>{"</>"}</span>
        </div>

        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join the AI Bug Management System</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name" style={styles.label}>
            Full Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />

          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password (minimum 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            maxLength={72}
            required
            style={styles.input}
          />

          {error && (
            <p role="alert" style={styles.error}>
              {error}
            </p>
          )}
          {success && (
            <p role="status" style={styles.success}>
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg, #f1f5f9)",
    color: "var(--text-h, #172033)",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    transition: "background-color 180ms ease, color 180ms ease",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    padding: "clamp(24px, 5vw, 36px)",
    background: "var(--surface, #ffffff)",
    color: "var(--text-h, #172033)",
    border: "1px solid var(--border, #dbe3ee)",
    borderRadius: "16px",
    boxShadow: "var(--shadow, 0 10px 20px -5px rgba(15,23,42,0.08))",
    boxSizing: "border-box",
    transition: "background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
  },
  brandMark: {
    width: "54px",
    height: "54px",
    borderRadius: "15px",
    margin: "0 auto 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--accent-bg, rgba(37,99,235,0.10))",
    border: "1px solid var(--accent-border, rgba(37,99,235,0.45))",
  },
  brandIcon: {
    fontSize: "21px",
    fontWeight: 800,
    color: "var(--accent, #2563eb)",
  },
  title: {
    fontSize: "clamp(23px, 4vw, 28px)",
    lineHeight: 1.25,
    textAlign: "center",
    color: "var(--text-h, #172033)",
    margin: "0 0 10px",
  },
  subtitle: {
    textAlign: "center",
    color: "var(--text, #475569)",
    margin: "0 0 28px",
    fontSize: "14px",
  },
  label: {
    display: "block",
    marginBottom: "7px",
    fontWeight: 600,
    fontSize: "14px",
    color: "var(--text-h, #172033)",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "18px",
    border: "1px solid var(--border, #cbd5e1)",
    borderRadius: "8px",
    boxSizing: "border-box",
    background: "var(--surface-secondary, #f8fafc)",
    color: "var(--text-h, #172033)",
    fontSize: "14px",
    outlineColor: "var(--accent, #2563eb)",
    transition: "background-color 180ms ease, border-color 180ms ease",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "var(--accent, #2563eb)",
    color: "#ffffff",
    border: "1px solid transparent",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px",
    transition: "opacity 180ms ease, transform 180ms ease",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "wait",
  },
  error: {
    color: "#dc2626",
    background: "rgba(220, 38, 38, 0.08)",
    border: "1px solid rgba(220, 38, 38, 0.2)",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "14px",
    overflowWrap: "anywhere",
  },
  success: {
    color: "#15803d",
    background: "rgba(21, 128, 61, 0.08)",
    border: "1px solid rgba(21, 128, 61, 0.2)",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "14px",
    overflowWrap: "anywhere",
  },
  footer: {
    textAlign: "center",
    marginTop: "22px",
    color: "var(--text, #475569)",
    fontSize: "14px",
  },
  link: {
    color: "var(--accent, #2563eb)",
    fontWeight: 700,
    textDecoration: "none",
  },
};
