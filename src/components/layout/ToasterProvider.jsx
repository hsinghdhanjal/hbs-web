"use client";
import { Toaster } from "sonner";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#1E1E1E",
          color: "#F8F7F4",
          border: "1px solid #C9A66B",
          borderRadius: 0,
          fontFamily: "Manrope, sans-serif",
          letterSpacing: "0.04em",
        },
      }}
    />
  );
}
