import { useState, useEffect, useRef, useCallback } from "react";

export function useDropdown() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const dropdownRef = useRef(null);

  const closeDropdown = useCallback(() => {
    if (!open) return;
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 160);
  }, [open]);

  const toggleDropdown = () => {
    open ? closeDropdown() : setOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdown();
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") closeDropdown();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [closeDropdown]);

  return {
    open,
    closing,
    dropdownRef,
    toggleDropdown,
    closeDropdown,
  };
}