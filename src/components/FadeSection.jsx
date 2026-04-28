import { motion } from 'framer-motion';
import { useInView } from '../hooks';

export default function FadeSection({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  style = {},
}) {
  const [ref, isVisible] = useInView(0.12);

  const initial = {
    opacity: 0,
    y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
    x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
    filter: 'blur(4px)',
  };

  const animate = isVisible
    ? { opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }
    : initial;

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
