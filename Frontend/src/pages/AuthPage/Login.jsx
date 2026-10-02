import { useState } from "react";
import { toast } from "react-hot-toast";
import { useFirebase } from "@/context/FirebaseContext";
import { Link, useNavigate } from "react-router-dom";

const AuthLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, getUserCart } = useFirebase();
  const navigate = useNavigate();

  const getUserRole = async (uid) => {
    try {
      const res = await import("@/context/FirebaseConfig");
      const { db } = res;
      const { doc, getDoc } = await import("firebase/firestore");

      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        return userDocSnap.data().role || "user";
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
    return "user";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const user = await login(email, password);
      toast.success("Login successful!");
  
      const role = await getUserRole(user.uid);
  
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      // Get Firebase Auth error code
      const errorCode = error.code;
  
      if (errorCode === "auth/user-not-found") {
        toast.error("No user found with this email.");
      } else if (errorCode === "auth/wrong-password") {
        toast.error("Invalid password. Please try again.");
      } else if (errorCode === "auth/invalid-email") {
        toast.error("Invalid email format.");
      } else {
        toast.error("Login failed! " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label>Email :</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <label>Password :</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          id="passwordInput"
          required
        />
        <input
          type="checkbox"
          onChange={(e) => {
            document.getElementById("passwordInput").type = e.target.checked
              ? "text"
              : "password";
          }}
          className="ml-2 mr-2"
        />
        Show Password
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="mt-2 flex justify-center items-center">
          Don't have an account?
          <Link
            className="font-medium ml-2 text-primary underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AuthLogin;