import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "@/context/FirebaseContext";
import { toast } from "react-hot-toast";

const AuthRegister = () => {
  const { signup } = useFirebase();
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoader(true);
      await signup(username, email, password);
      toast.success("Account created successfully!");
      setLoader(false);
      navigate("/auth/login");
    } catch (error) {
      toast.error(error.message);
      setLoader(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label>UserName : </label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <label>Email : </label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <label>Password : </label>
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
          className="w-full bg-primary text-white py-2 rounded"
        >
          {loader ? "Loading..." : "Sign Up"}
        </button>
        <p className="mt-2 flex justify-center items-center">
          Already have an account?
          <Link
            className="font-medium ml-2 text-primary underline justify-center"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AuthRegister;
