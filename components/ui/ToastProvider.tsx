"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={12}
      containerStyle={{
        top: 24,
        zIndex: 99999,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "var(--font-cairo), sans-serif",
          direction: "rtl",
          borderRadius: "14px",
          padding: "14px 20px",
          fontSize: "14px",
          fontWeight: "600",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          maxWidth: "480px",
        },
        success: {
          style: {
            background: "#ffffff",
            color: "#065f46",
            border: "1px solid #10b98133",
            boxShadow: "0 12px 28px -4px rgba(16, 185, 129, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(16, 185, 129, 0.15)",
          },
          iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
          },
        },
        error: {
          style: {
            background: "#ffffff",
            color: "#991b1b",
            border: "1px solid #ef444433",
            boxShadow: "0 12px 28px -4px rgba(239, 68, 68, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(239, 68, 68, 0.15)",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
        loading: {
          style: {
            background: "#ffffff",
            color: "#92400e",
            border: "1px solid #df9f0033",
            boxShadow: "0 12px 28px -4px rgba(223, 159, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(223, 159, 0, 0.15)",
          },
          iconTheme: {
            primary: "#df9f00",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
