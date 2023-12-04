function Footer() {
  return (
    <div className="footer-container mt-[150px] h-[120px] w-full px-[128px] text-sm font-semibold text-[#222222]">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/filter-14ea1.appspot.com/o/Filter-logos_transparent_cut.png?alt=media&token=d3119f34-30f8-4afe-8e1c-6e74367acf7c"
        alt="site-logo"
        className="h-auto w-[200px]"
      />
      <div className="mt-5 flex w-full justify-between font-thin">
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
