import MainHeader from "@/components/navigation/MainHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainHeader />
      <div className="pt-16">{children}</div>
    </>
  );
}

