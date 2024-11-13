import * as navbars from "./navbars";

export function Base1({ children }: any) {
  return (
    <main className={"m-0 p-0 flex "}>
      <navbars.Navbar />
      {children}
    </main>
  );
}