'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// NavLink mit Pink Touch Feedback
function NavLink({ children, href, onClick }: { children: React.ReactNode, href: string, onClick: () => void }) {
  const [isActive, setIsActive] = useState(false);
  
  // Basis-Styles aus navItemStyle
  const linkStyle: React.CSSProperties = {
    padding: '24px 0',
    fontSize: '32px',  
    fontWeight: '700',  
    color: isActive ? 'hsl(330, 82%, 60%)' : 'white', // Pink Farbe bei aktiv
    display: 'block',
    width: '100%',
    textAlign: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'color 0.2s ease, transform 0.1s ease',
    transform: isActive ? 'scale(1.05)' : 'scale(1)', // Leichte Vergrößerung bei Berührung
    position: 'relative',
    outline: 'none',
  };

  return (
    <Link 
      href={href} 
      style={linkStyle}
      onClick={onClick}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setIsActive(false)}
      onTouchCancel={() => setIsActive(false)}
    >
      {children}
    </Link>
  );
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Nur Body-Overflow kontrollieren
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Nicht rendern, wenn geschlossen
  if (!isOpen) return null;
  
  // Header-Höhe aus der Header-Komponente (kann angepasst werden, falls nötig)
  const headerHeight = '72px';
  
  // Menü-Style - Beginnt erst nach dem Header, sodass der Header mit dem X sichtbar bleibt
  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    top: headerHeight, // Erst unterhalb des Headers beginnen
    right: '0',
    left: '0',
    bottom: '0',
    width: '100%',
    backgroundColor: '#000', // Volle schwarze Farbe für bessere Lesbarkeit
    zIndex: 998, // Niedriger als der Header (der normalerweise z-index 999 oder 1000 hat)
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Perfekt in der Mitte zentriert
    overflowY: 'auto',
    transition: 'opacity 0.3s ease',
  };

  // Backdrop-Style - startet ebenfalls erst unterhalb des Headers
  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: headerHeight, // Erst unterhalb des Headers beginnend
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 997, // Noch niedriger als das Menü
  };

  // Navigation-Item-Style wurde in die NavLink-Komponente verschoben

  // Close-Button-Style
  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '28px',
    fontWeight: '300',
  };

  // Logo-Style
  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
    marginBottom: '60px',
    letterSpacing: '2px',
  };

  // Nav-Container Style - optimiert für perfekte Zentrierung
  const navContainerStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',  // Mehr Abstand zwischen den Menüpunkten
  };
  
  // Das Menü direkt in den document.body einfügen (Portal)
  return createPortal(
    <>
      {/* Backdrop für den Klick außerhalb */}
      <div style={backdropStyle} onClick={onClose} />
      
      {/* Menü */}
      <div style={menuStyle} onClick={(e) => e.stopPropagation()}>
        {/* Navigation - ohne Logo-Text */}
        <nav style={navContainerStyle}>
          <NavLink href="/spielerklaerung" onClick={onClose}>
            SPIELERKLÄRUNG
          </NavLink>
          
          <NavLink href="/intention" onClick={onClose}>
            INTENTION
          </NavLink>

          <NavLink href="/kontakt" onClick={onClose}>
            KONTAKT
          </NavLink>
        </nav>
      </div>
    </>,
    document.body
  );
}
