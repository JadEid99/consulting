import { useSmoothScroll } from '../hooks/useSmoothScroll'

const ScrollTest = () => {
  const { scrollY, scrollProgress, isScrolling } = useSmoothScroll()

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 1000,
      fontFamily: 'monospace'
    }}>
      <div>Scroll Y: {Math.round(scrollY)}px</div>
      <div>Progress: {Math.round(scrollProgress * 100)}%</div>
      <div>Scrolling: {isScrolling ? 'Yes' : 'No'}</div>
    </div>
  )
}

export default ScrollTest
