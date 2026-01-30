import Header from "./Header";
import BottomNavBar from "./BottomNavBar";

export default function UserLayout({ children, activeRoute, showHeader = true }) {
  return (
    <div className="min-h-screen flex flex-col " style={{
      background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
      animation: 'gradientShift 15s ease infinite'
    }}>
      {/* Header */}
      {showHeader && (
        <>
          <hr></hr>
          <Header activeRoute={activeRoute} />
          <hr ></hr>
        </>
      )}
      {/* Main Content */}
      <div className="pt-2"></div>
      <main>
        {children}
      </main>
      <BottomNavBar />
    </div>
  );
}


