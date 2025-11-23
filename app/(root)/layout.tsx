import NavBar from "./components/NavBar";
export default function Layout({ children }: { children: React.ReactElement }) {
  return (
    <div className="px-5 md:px-10 xl:px-14">
      <NavBar />
      <div className="pt-10 md:pt-20">
        {children}
      </div>
    </div>
  );
}
