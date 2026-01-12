import UserLayout from "./UserLayout";

export default function UserLayoutScreen({ component: Component, children, showHeader = false, backgroundClass = "", hideNav = false }) {
  const content = Component ? <Component /> : children;

  return (
    <UserLayout showHeader={showHeader} backgroundClass={backgroundClass} hideNav={hideNav}>
      <div className="w-full">
        {content}
      </div>
    </UserLayout>
  );
}
