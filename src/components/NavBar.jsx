function NavBar() {
  return (
    <nav className="flex justify-between items-center px-10 py-1 bg-white">
      <h1 className="text-2xl font-bold">DEV@Deakin</h1>
      <div className="flex gap-7">
        <a href="#about">About</a>
        <a href="#work">Work</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  )
}

export default NavBar
