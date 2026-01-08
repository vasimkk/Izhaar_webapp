import UserLayout from "./UserLayout";
import WritePromptScreen from "./LetterIzhaar/WritePromptScreen";

export default function WritePromptScreenPage() {
  return (
    <UserLayout showHeader={false}>
      <div className="w-full">
        <WritePromptScreen />
      </div>
    </UserLayout>
  );
}
