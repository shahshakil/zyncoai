import MainHeader from "@/components/navigation/MainHeader";

// Covers login/signup/forgot/reset-password/verify-email/verify-mfa/
// setup-mfa/accept-invite in one place — none of these are useful for a
// search engine to index (they're either a form with no unique content, or
// a token-gated flow).
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainHeader />
      <div className="pt-16">{children}</div>
    </>
  );
}

