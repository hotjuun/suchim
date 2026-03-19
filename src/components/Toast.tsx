"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  type?: "success" | "error";
}

export default function Toast({
  message,
  show,
  onClose,
  type = "success",
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !visible) return null;

  return (
    <div
      className={`fixed left-1/2 top-12 z-[100] -translate-x-1/2 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <div
        className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium text-white shadow-lg ${
          type === "success" ? "bg-primary" : "bg-accent"
        }`}
      >
        <span>{type === "success" ? "✓" : "!"}</span>
        {message}
      </div>
    </div>
  );
}
