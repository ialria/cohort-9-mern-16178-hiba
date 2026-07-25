
function LeafletLogo({className}) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <rect x="18" y="18" width="64" height="64" rx="18" ry="18"
        fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 62 82 C 38 34, 24 34, 18 34"
        fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  )
}

export default LeafletLogo