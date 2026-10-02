import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/context/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import axios from "axios";
import toast from "react-hot-toast";

const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const getUserRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      return userDoc.exists() ? userDoc.data().role : "user";
    } catch (error) {
      console.error("Error fetching user role:", error);
      return "user";
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setUser(user);
      setLoading(false);

      if (user) {
        const userRole = await getUserRole(user.uid);
        setRole(userRole);

        const savedCart = await getUserCart(user.uid);
        setCartItems(savedCart);
        // console.log("User cart loaded:", savedCart);
      } else {
        setRole(null);
        setCartItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const saveCartToFirestore = async () => {
      if (user) {
        const validItems = cartItems.filter(
          (item) =>
            (item.id || item.docId) &&
            item.name &&
            item.price !== undefined &&
            item.image &&
            item.quantity !== undefined
        );
        const cartRef = doc(db, "carts", user.uid);
        await setDoc(cartRef, { items: validItems });
        // console.log("Cart items updated in Firestore:", validItems);
      }
    };

    saveCartToFirestore();
  }, [cartItems, user]);

  const signup = async (username, email, password) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;
      await createUser(newUser.uid, username, newUser.email);
      setLoading(false);
      return newUser;
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/email-already-in-use") {
        throw new Error("Email is already in use.");
      } else if (error.code === "auth/weak-password") {
        throw new Error("Password should be at least 6 characters.");
      } else {
        console.error("Signup error:", error.message);
        throw error;
      }
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      const errorCode = error.code;
  
      if (
        errorCode === "auth/user-not-found" ||
        errorCode === "auth/wrong-password" ||
        errorCode === "auth/invalid-credential"
      ) {
        throw new Error("Invalid email or password.");
      } else if (errorCode === "auth/invalid-email") {
        throw new Error("Invalid email format.");
      } else if (errorCode === "auth/too-many-requests") {
        throw new Error("Too many failed login attempts. Please try again later.");
      } else {
        console.error("Login error:", error.message);
        throw new Error("Something went wrong. Please try again.");
      }
    }
  };
  

  const signinWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      await createUser(user.uid, user.displayName || "Google User", user.email);
      return user;
    } catch (error) {
      console.error("Google Sign-In error:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error.message);
      throw error;
    }
  };

  const createUser = async (uid, username, email) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          username,
          email,
          role: "user",
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Stores-Images");

    try {
      const response = await axios.post(
        `use_your_cloudinary_upload_location_to_upload_the_images`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error", error);
      return null;
    }
  };

  const getProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      return querySnapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  const getProductById = async (docId) => {
    try {
      const productRef = doc(db, "products", docId);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        return { docId, ...productSnap.data() };
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  };

  const handleToggleVisibility = async (productId, isVisible) => {
    try {
      await updateProduct(productId, { visible: isVisible });
      toast.success(
        `Product ${isVisible ? "visible" : "hidden"} successfully!`
      );
    } catch (error) {
      toast.error("Failed to update product visibility.");
      console.error("Error updating visibility:", error);
    }
  };

  const updateProduct = async (productId, updatedData) => {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, updatedData);
  };

  const deleteProduct = async (productId) => {
    try {
      const productRef = doc(db, "products", productId);
      await deleteDoc(productRef);
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const addToCart = (item) => {
    const cartItem = {
      ...item,
      id: item.id || item.docId, // fallback
      quantity: item.quantity || 1,
    };

    if (!cartItem.id || !cartItem.name || cartItem.price === undefined || !cartItem.image) {
      console.error("Invalid cart item:", cartItem);
      return;
    }

    setCartItems((prevItems) => {
      const index = prevItems.findIndex(
        (i) => i.id === cartItem.id && i.size === cartItem.size
      );
      if (index !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[index].quantity += cartItem.quantity;
        return updatedItems;
      }
      return [...prevItems, cartItem];
    });
  };

  const addToUserCart = async (uid, item) => {
    const cartItem = {
      ...item,
      id: item.id || item.docId, // fallback
      quantity: item.quantity || 1,
    };

    if (!cartItem.id || !cartItem.name || cartItem.price === undefined || !cartItem.image) {
      console.error("Invalid cart item:", cartItem);
      return;
    }

    try {
      const existingCart = await getUserCart(uid);
      const index = existingCart.findIndex(
        (i) => i.id === cartItem.id && i.size === cartItem.size
      );

      if (index !== -1) {
        existingCart[index].quantity += cartItem.quantity;
      } else {
        existingCart.push(cartItem);
      }

      const cartRef = doc(db, "carts", uid);
      await setDoc(cartRef, { items: existingCart });
      console.log("User cart updated:", existingCart);
    } catch (error) {
      console.error("Error updating user cart:", error);
    }
  };

  const getUserCart = async (uid) => {
    const cartRef = doc(db, "carts", uid);
    const cartSnap = await getDoc(cartRef);
    return cartSnap.exists() ? cartSnap.data().items || [] : [];
  };

  return (
    <FirebaseContext.Provider
      value={{
        db,
        user,
        currentUser,
        role,
        loading,
        signup,
        login,
        signinWithGoogle,
        logout,
        handleImageUpload,
        getProducts,
        handleToggleVisibility,
        updateProduct,
        deleteProduct,
        getProductById,
        addToCart,
        addToUserCart,
        cartItems,
        setCartItems,
        getUserCart,
        getUserRole
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
