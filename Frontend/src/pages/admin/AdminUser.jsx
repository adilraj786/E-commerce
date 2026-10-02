import React, { useEffect, useState } from "react";
import { useFirebase } from "@/context/FirebaseContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/context/FirebaseConfig";

function AdminUser() {
  const firebase = useFirebase();
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    if (!db) {
      return [];
    }
    const fetchdata = async () => {
      try {
        const UserSnapshot = await getDocs(collection(db, "users"));
        setTotalUsers(UserSnapshot.size);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchdata();
  }, [firebase]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  return (
    <div>
      <h2 className="p-4 font-bold text-gray-700 text-lg">User Management</h2>
    </div>
  );
};

export default AdminUser;
