import { useState } from "react";

export default function useModal(initialState = false) {
  const [isModalOpen, setIsModalOpen] = useState(initialState);

  function openModal() {
    setIsModalOpen(true);
  }
  function closeModal() {
    setIsModalOpen(false);
  }

  return {
    isModalOpen,
    openModal,
    closeModal,
  };
}
