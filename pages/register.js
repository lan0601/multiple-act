import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign up the user using Supabase auth
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Optionally, handle user-specific data here (e.g., save additional user info in a database)

      // Redirect to login page after successful registration
      router.push("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <button type="submit" style={{ padding: "10px", width: "100%" }} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <p>
          Already have an account?{" "}
          <button
            onClick={() => router.push("/")} // Redirect to login page
            style={{
              background: "none",
              border: "none",
              color: "blue",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
