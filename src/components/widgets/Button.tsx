import React, { ButtonHTMLAttributes, MouseEvent, useState } from 'react';
import './Button.css';

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  const [isPressed, setIsPressed] = useState(false);
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    
    setTimeout(() => {
      setIsPressed(false);
      if (props.onClick) {
        props.onClick(e);
      }
    }, 200);
  }

  return (
    <button
      {...props}
      onClick={onClick}
      className={`button ${isPressed ? 'button--pressed' : ''} ${props.className}`}
    >
      {props.children}
    </button>
  );
}

export default Button;
