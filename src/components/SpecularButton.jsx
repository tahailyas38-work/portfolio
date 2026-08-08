'use client';

import { useRef } from 'react';
import SpecularEdge from './SpecularEdge';
import './SpecularButton.css';

const SpecularButton = ({
  children = 'Get Started',
  size = 'lg',
  radius = 18,
  tint = '#ffffff',
  tintOpacity = 0,
  blur = 0,
  textColor = '#f5f5f5',
  lineColor = '#ffffff',
  baseColor = '#525252',
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button'
}) => {
  const btnRef = useRef(null);

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`specular-button specular-button--${size}${className ? ` ${className}` : ''}`}
      style={{
        '--sb-radius': `${radius}px`,
        '--sb-tint': tint,
        '--sb-tint-opacity': tintOpacity,
        '--sb-blur': `${blur}px`,
        '--sb-text-color': textColor
      }}
    >
      <SpecularEdge
        hostRef={btnRef}
        radius={radius}
        lineColor={lineColor}
        baseColor={baseColor}
        intensity={intensity}
        shineSize={shineSize}
        shineFade={shineFade}
        thickness={thickness}
        speed={speed}
        followMouse={followMouse}
        proximity={proximity}
        autoAnimate={autoAnimate}
      />
      <span className="specular-button__label">{children}</span>
    </button>
  );
};

export default SpecularButton;
