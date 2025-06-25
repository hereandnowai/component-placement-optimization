
import React from 'react';

// Using provided logo URL
const logoUrl = "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png";

export const LogoIcon: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img 
    src={logoUrl}
    alt="HERE AND NOW AI Logo"
    {...props} // Spread props to allow className, style, etc.
  />
);