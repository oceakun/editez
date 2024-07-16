import NoteContainer from "./NoteContainer";
import ProtectedRoute from "../ProtectedRoute";
export default function Notes() {

  return (
    <ProtectedRoute>
      <main className="flex flex-col px-10 text-center flex-grow bg-black gap-4 w-full">
        <NoteContainer />
      </main>
    </ProtectedRoute>
  );
}
