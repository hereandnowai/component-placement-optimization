
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyle = "font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
  
  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-primary text-secondary hover:bg-yellow-500 focus:ring-yellow-400';
      break;
    case 'secondary':
      variantStyle = 'bg-accent text-white hover:bg-teal-700 focus:ring-accent';
      break;
    case 'outline':
      variantStyle = 'bg-transparent border border-secondary text-secondary hover:bg-secondary hover:text-primary dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-secondary focus:ring-secondary dark:focus:ring-primary';
      break;
    case 'ghost':
      variantStyle = 'bg-transparent text-secondary hover:bg-gray-200 dark:text-primary dark:hover:bg-gray-700 focus:ring-secondary dark:focus:ring-primary';
      break;
    case 'icon':
      variantStyle = 'p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-secondary dark:focus:ring-primary';
      break;
    default:
      variantStyle = 'bg-primary text-secondary hover:bg-yellow-500 focus:ring-yellow-400';
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
