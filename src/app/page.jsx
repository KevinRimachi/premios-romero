"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Modals from "@/components/Modals";
import Footer from "@/components/Footer";

export default function Home() {
  const [isTicketsModalOpen, setIsTicketsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isInactiveModalOpen, setIsInactiveModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState(null);

  const [successData, setSuccessData] = useState(null);

  return (
    <>
      <Header onOpenTickets={() => setIsTicketsModalOpen(true)} />
      
      <Hero 
        onOpenForm={(draw) => { setSelectedDraw(draw); setIsFormModalOpen(true); }}
        onOpenInactive={() => setIsInactiveModalOpen(true)}
      />

      <Footer onOpenAdmin={() => setIsAdminModalOpen(true)} />

      <Modals 
        isTicketsModalOpen={isTicketsModalOpen}
        closeTicketsModal={() => setIsTicketsModalOpen(false)}
        isAdminModalOpen={isAdminModalOpen}
        closeAdminModal={() => setIsAdminModalOpen(false)}
        isInactiveModalOpen={isInactiveModalOpen}
        closeInactiveModal={() => setIsInactiveModalOpen(false)}
        isPauseModalOpen={isPauseModalOpen}
        closePauseModal={() => setIsPauseModalOpen(false)}
        isFormModalOpen={isFormModalOpen}
        closeFormModal={() => setIsFormModalOpen(false)}
        selectedDraw={selectedDraw}
        onSuccess={(data) => { setIsFormModalOpen(false); setSuccessData(data); }}
        successData={successData}
        closeSuccessModal={() => setSuccessData(null)}
      />
    </>
  );
}
