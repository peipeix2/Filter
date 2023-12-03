function Footer() {
  return (
    <div className="footer-container mt-[52px] h-[120px] w-full px-[128px] text-sm font-semibold text-[#222222]">
      <h1>Site Logo</h1>
      <div className='flex justify-between w-full font-thin mt-10'>
        <ul className="legal term flex gap-3">
          <li>Cookie Policy</li>
          <li>Legal Terms</li>
          <li>Privacy Policy</li>
        </ul>
        <ul className="footer-items flex justify-end gap-3">
          <li>Instagram</li>
          <li>Line</li>
          <li>Facebook</li>
          <li>X</li>
        </ul>
      </div>
    </div>
  )
}

export default Footer