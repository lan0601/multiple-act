import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Check if the user is already logged in and redirect
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log(session);
        router.push("/secret-page-1");  // Redirect to dashboard if session exists
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check for session after login
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Redirect user to dashboard after successful login
        router.push("/secret-page-1");
      } else {
        setError("Session could not be established.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ padding: "10px", width: "100%" }}>
          Login
        </button>
      </form>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <p>
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/register")} // Redirect to register page
            style={{
              background: "none",
              border: "none",
              color: "blue",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};Q

export default Login;
