'use client'
import { useState, createContext, useEffect } from 'react'
import Modal from '@/components/Layout/Modal'

const ModalContext = createContext<{
  modal: React.ReactNode | null
  openModal: (modal: React.ReactNode) => void
  modalWidth: (width: string) => void
  closeModal: () => void
}>({
  modal: null,
  openModal: () => {},
  closeModal: () => {},
  modalWidth: () => {},
})

const ModalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [modal, setModal] = useState<React.ReactNode | null>(null)
  const [width, setModalWidth] = useState('')

  const openModal = (modal: React.ReactNode) => {
    setModal(modal)
  }

  const closeModal = () => {
    setModal(null)
  }

  const modalWidth = (width: string) => {
    setModalWidth(width)
  }

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal, modalWidth }}>
      <Modal modalWidth={width} open={modal !== null} onClose={closeModal}>
        {modal}
      </Modal>
      {children}
    </ModalContext.Provider>
  )
}

export { ModalContext, ModalContextProvider }
