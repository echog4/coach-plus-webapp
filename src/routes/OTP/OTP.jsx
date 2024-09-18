import { PageContainer } from "../../components/PageContainer/PageContainer";
import { useState } from "react";
import { useAuth, useSupabase } from "../../providers/AuthContextProvider";
import { Navigate } from "react-router-dom";

export const OTP = () => {
  const [otpSent, setOtpSent] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const supabase = useSupabase();
  const { user } = useAuth();
  console.log(user);

  const onSend = async () => {
    setOtpSent(true);
    await supabase.functions.invoke("otp-wp", {
      body: { phone: user.phone_number, user_id: user.id },
    });
  };

  const onSubmit = async (data) => {
    const { data: res, error } = await supabase.functions.invoke("otp-verify", {
      body: { code },
    });
    console.log(res, error);
    if (res.error || error) {
      alert("Invalid OTP");
    }

    window.location.href = "/";
  };

  if (user && user.status === "VERIFIED") {
    return <Navigate to="/" />;
  }

  return (
    <PageContainer>
      <h1>One Time Code</h1>
      <p>We need to verify your phone number with a one time code</p>
      {!otpSent && (
        <button
          disabled={loading}
          onClick={async () => {
            try {
              setLoading(true);
              await onSend();
              setOtpSent(true);
            } catch (error) {
              alert("Error sending OTP");
              setOtpSent(false);
            }
            setLoading(false);
          }}
        >
          Send OTP
        </button>
      )}
      {otpSent && (
        <>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <br />
          <br />
          <button onClick={onSubmit}>Verify OTP</button>
        </>
      )}
    </PageContainer>
  );
};
