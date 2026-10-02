import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/context/FirebaseConfig";
import toast from "react-hot-toast";

const AdminFooterSettings = () => {
  const [data, setData] = useState({
    aboutUs: "",
    quickLinks: [{ label: "", url: "" }],
    contact: { address: "", email: "", phone: "" },
  });

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "settings", "footer");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
    };
    fetchData();
  }, []);

  const handleChange = (e, index, field, isLink = false) => {
    if (isLink) {
      const newLinks = [...data.quickLinks];
      newLinks[index][field] = e.target.value;
      setData((prev) => ({ ...prev, quickLinks: newLinks }));
    } else {
      setData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    }
  };

  const handleContactChange = (e, field) => {
    setData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: e.target.value,
      },
    }));
  };

  const addLink = () => {
    setData((prev) => ({
      ...prev,
      quickLinks: [...prev.quickLinks, { label: "", url: "" }],
    }));
  };

  const save = async () => {
    await setDoc(doc(db, "settings", "footer"), data);
    toast.success("Footer settings updated!");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Footer Settings</h2>

      <label className="block mb-2 font-semibold">About Us</label>
      <textarea
        className="w-full border p-2 mb-4"
        value={data.aboutUs}
        onChange={(e) => handleChange(e, null, "aboutUs")}
      />

      <label className="block mb-2 font-semibold">Quick Links</label>
      {data.quickLinks.map((link, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            className="flex-1 border p-2"
            placeholder="Label"
            value={link.label}
            onChange={(e) => handleChange(e, index, "label", true)}
          />
          <input
            className="flex-1 border p-2"
            placeholder="URL"
            value={link.url}
            onChange={(e) => handleChange(e, index, "url", true)}
          />
        </div>
      ))}
      <button className="mb-4 text-blue-600" onClick={addLink}>
        + Add Link
      </button>

      <h3 className="text-lg font-semibold">Contact Info</h3>
      <input
        className="w-full border p-2 mb-2"
        placeholder="Address"
        value={data.contact.address}
        onChange={(e) => handleContactChange(e, "address")}
      />
      <input
        className="w-full border p-2 mb-2"
        placeholder="Email"
        value={data.contact.email}
        onChange={(e) => handleContactChange(e, "email")}
      />
      <input
        className="w-full border p-2 mb-4"
        placeholder="Phone"
        value={data.contact.phone}
        onChange={(e) => handleContactChange(e, "phone")}
      />

      <button
        className="bg-blue-600 text-white px-6 py-2 rounded"
        onClick={save}
      >
        Save
      </button>
    </div>
  );
};

export default AdminFooterSettings;
