import logo from "../../assets/logo.png";

const Header = () => {
  return (
    <header className="w-full flex items-center justify-between bg-white/60 backdrop-blur-md rounded-2xl mt-8 px-4 py-2 md:px-12 md:py-4 shadow-lg max-w-6xl mx-auto">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="w-12 h-12 md:w-16 md:h-16" />
      </div>
      <nav className="hidden md:flex gap-6 lg:gap-12 text-black font-medium text-base lg:text-lg">
        <a href="#home" className="hover:text-pink-500 transition-colors">HOME</a>
        <a href="#features" className="hover:text-pink-500 transition-colors">FEATURES</a>
        <a href="#how-it-works" className="hover:text-pink-500 transition-colors">HOW IT WORKS</a>
        <a href="#about-us" className="hover:text-pink-500 transition-colors">ABOUT US</a>
        <a href="#prices" className="hover:text-pink-500 transition-colors">PRICES</a>
      </nav>
      <div className="flex items-center">
        <button className="bg-black text-white rounded-lg px-5 py-2 font-semibold text-sm md:text-base hover:bg-pink-500 transition-colors">SignUp/Login</button>
      </div>
     
    </header>
  );
};

export default Header;
