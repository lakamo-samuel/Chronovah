import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../ui/Spinner";

export default function OtpVerification() {

  const { refresh } = useAuth();
  const navigate = useNavigate()
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) return setError("Invalid OTP code.");
    setError("");

    // Backend connect here
    try {
      setIsLoading(true);
     const res = await fetch("http://localhost:8000/api/user/verify-email", {
       method: "PUT",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ verificationCode: code }),
       credentials: "include", // send HttpOnly cookie
     });

     const data = await res.json();

     if (!res.ok) {
       setError(data.error || "Invalid verification code");
       setIsLoading(false);
       return;
     }

     // Update global user state
     await refresh();

     // Redirect to dashboard
     navigate("/dashboard");
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   } catch (err: any) {
     setError(err?.message || "Network error, please try again.");
    } finally {
      setIsLoading(false);
   }
  };

 const resend = async () => {
   setTimer(30);
   setOtp(Array(6).fill(""));

   try {
     const res = await fetch(
       "http://localhost:8000/api/user/resend-verification",
       {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email: "lakamosamuel7@gmail.com" }),
         credentials: "include",
       }
     );

     if (!res.ok) {
       const data = await res.json();
       setError(data.error || "Failed to resend OTP");
       return;
     }
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   } catch (err: any) {
     setError(err?.message || "Network error");
   }
 };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-white  dark:bg-[#0B1120] rounded-2xl shadow-lg border border-gray-200 dark:border-[#0b1220] p-6"
      >
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Verify OTP
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Enter the 6-digit code sent to your email.
        </p>

        <div className="flex justify-center gap-2 sm:gap-3 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              maxLength={1}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-9 h-9 sm:w-12 sm:h-12 text-center rounded-xl border border-gray-300 dark:border-[#14202b] bg-gray-50 dark:bg-gray-900 text-lg font-semibold text-gray-900 dark:text-gray-100 outline-none"
            />
          ))}
        </div>

        {error && <p className="text-xs text-red-500 text-center">{error}</p>}

        <button className="w-full mt-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          Verify
        </button>
        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
            loading
              ? "bg-blue-400 cursor-wait"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {loading ? (
            <>
              <Spinner size="sm" overlay={false} color="white" thickness={2} />
              <span>Verifying...</span>
            </>
          ) : (
            "Verify"
          )}
        </button>
        <div className="mt-4 text-center">
          {timer > 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Resend code in {timer}s
            </p>
          ) : (
            <button
              onClick={resend}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        <Link
          to="/signin"
          className="flex items-center gap-1 mt-6 text-sm text-gray-600 dark:text-gray-400 hover:underline"
        >
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      </motion.div>
    </div>
  );
}
