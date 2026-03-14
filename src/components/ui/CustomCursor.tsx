import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 250, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [hoverType, setHoverType] = useState<'default' | 'video' | 'map'>('default');

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true);
        setHoverType('default');
      } 
      else if (target.closest('.video-container')) {
        setIsHovering(true);
        setHoverType('video');
      }
      else if (target.closest('.leaflet-container')) {
        setIsHovering(true);
        setHoverType('map');
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[100] flex items-center justify-center font-mono text-[10px] text-primary tracking-widest hidden md:flex"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        scale: isHovering ? (hoverType === 'default' ? 2 : 1.5) : 1,
        backgroundColor: isHovering && hoverType === 'default' ? 'transparent' : 'hsl(var(--primary))',
        border: isHovering && hoverType === 'default' ? '1px solid hsl(var(--primary))' : 'none',
        mixBlendMode: hoverType === 'default' ? 'difference' : 'normal',
      }}
    >
      {isHovering && hoverType === 'video' && 'PLAY'}
      {isHovering && hoverType === 'map' && 'EXPLORE'}
    </motion.div>
  );
}
