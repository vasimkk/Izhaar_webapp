import UserLayout from "./UserLayout";

export default function UserLayoutScreen({ component: Component, children, showHeader = false, backgroundClass = "" }) {
  const content = Component ? <Component /> : children;

  return (
    <UserLayout showHeader={showHeader} backgroundClass={backgroundClass}>
      <div className="w-full">
        {content}
      </div>
    </UserLayout>
  );
}
