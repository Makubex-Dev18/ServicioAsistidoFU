import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-bg-card text-text-primary border-t border-border-default py-5 ">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 text-sm">
        <p className="text-center sm:text-left">
          © {currentYear} <span className="font-semibold">Servicio Atencion - Farmacia Universal </span>. 
          Todos los derechos reservados.
        </p>

        <div className="flex gap-4 mt-2 sm:mt-0">
          <a
            href="#"
            className="hover:text-primary-500 transition-colors"
            aria-label="Política de privacidad"
          >
            Privacidad
          </a>
          <a
            href="#"
            className="hover:text-primary-500 transition-colors"
            aria-label="Términos y condiciones"
          >
            Términos
          </a>
           <a
            href="#"
            className="hover:text-primary-500 transition-colors"
            aria-label="Contactanos"
          >
            Contactanos
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
