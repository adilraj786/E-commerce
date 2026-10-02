import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/context/FirebaseConfig";


const Footer = () => {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchFooter = async () => {
      const docRef = doc(db, "settings", "footer");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFooterData(docSnap.data());
      }
    };
    fetchFooter();
  }, []);

  if (!footerData) return null;

  const { aboutUs, quickLinks, contact } = footerData;

  return (
    <footer className="w-full px-4 md:px-8 bg-gray-900 text-white flex flex-col justify-between min-h-[250px]">
      <section className="py-12 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <p className="text-gray-400">{aboutUs}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="text-gray-400 hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">📍 {contact.address}</p>
            <p className="text-gray-400">📧 {contact.email}</p>
            <p className="text-gray-400">📞 {contact.phone}</p>
          </div>
        </div>
      </section>

      {/* Footer Bottom */}
      <div className="text-center text-gray-500 border-t border-gray-700 py-4 w-full">
        <p>
          &copy; {new Date().getFullYear()} FashionStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
