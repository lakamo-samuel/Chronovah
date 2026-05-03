import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  AlertCircle,
  Loader,
  BookHeart,
  Users,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { protectedAxios } from "../../axios";
import { useAuth } from "../hooks/useAuth";

const FEATURES = [
  "Unlimited journal entries",
  "Unlimited people profiles",
  "Unlimited place memories",
  "Cross-device sync",
  "End-to-end encryption",
  "Priority support",
];

const UNLOCKED = [
  { icon: BookHeart, label: "Journal", bg: "bg-journal-soft", color: "text-[var(--color-journal-light)]" },
  { icon: Users,     label: "People",  bg: "bg-people-soft",  color: "text-[var(--color-people-light)]" },
  { icon: MapPin,    label: "Places",  bg: "bg-places-soft",  color: "text-[var(--color-places-light)]" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export default function UpgradePage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin", { state: { from: "/upgrade" } });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-default">
        <Loader className="h-7 w-7 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!user) return null;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n);

  const amount = billingPeriod === "yearly" ? 25000 : 2500;
  const amountFormatted = fmt(amount);

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await protectedAxios.post("/subscription/initialize", { billingPeriod });
      if (response.data.authorizationUrl) {
        window.location.href = response.data.authorizationUrl;
      } else {
        setError("Failed to initialize payment. Please try again.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to initialize payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-default">
      {/* ── Top nav bar ── */}
      <div className="sticky top-0 z-40 border-b border-default bg-default/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("/pricing")}
            className="flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft size={15} />
            Back to pricing
          </button>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Lock size={12} className="text-primary-500" />
            Secured by Paystack
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        {/* ── Page heading ── */}
        <motion.div {...fadeUp(0)} className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Checkout
          </p>
          <h1 className="font-display text-4xl font-normal tracking-tight text-primary sm:text-5xl">
            Unlock Chronovah Pro
          </h1>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">

          {/* ── Left — payment form ── */}
          <motion.div {...fadeUp(0.08)} className="order-2 lg:order-1">
            <div className="rounded-2xl border border-default bg-card p-8">
              <h2 className="mb-6 text-xl font-bold text-primary">Complete your upgrade</h2>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/8 p-4"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Account info */}
              <div className="mb-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                    Name
                  </label>
                  <div className="rounded-xl border border-default bg-default px-4 py-3 text-sm text-muted">
                    {user.name}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                    Email
                  </label>
                  <div className="rounded-xl border border-default bg-default px-4 py-3 text-sm text-muted">
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Billing period */}
              <div className="mb-8">
                <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-muted">
                  Billing period
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["monthly", "yearly"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setBillingPeriod(p)}
                      className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                        billingPeriod === p
                          ? "border-primary-500/70 bg-primary-500/5"
                          : "border-default bg-default hover:border-primary-500/30"
                      }`}
                    >
                      {p === "yearly" && (
                        <span className="absolute -top-2.5 -right-1 rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          Save 17%
                        </span>
                      )}
                      <p className="text-sm font-semibold text-primary capitalize">{p}</p>
                      <p className="mt-0.5 text-sm text-muted">
                        {p === "yearly" ? "₦25,000 / year" : "₦2,500 / month"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pay button */}
              <button
                onClick={handleUpgrade}
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-4 text-sm font-semibold text-white shadow-medium transition-all hover:bg-primary-700 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    Pay {amountFormatted} with Paystack
                    <ArrowRight size={15} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-muted">
                You will be redirected to Paystack to complete payment securely.
              </p>

              {/* No-refund notice */}
              <div className="mt-5 rounded-xl border border-default bg-default p-4">
                <p className="text-xs leading-relaxed text-muted">
                  <span className="font-semibold text-primary">No refunds.</span>{" "}
                  All payments are final. You may cancel at any time to stop future charges — Pro access continues until the end of your billing period. Please review your selection before paying.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Right — order summary ── */}
          <motion.div {...fadeUp(0.14)} className="order-1 lg:order-2">
            <div className="sticky top-24 rounded-2xl border border-default bg-card p-8">
              <h2 className="mb-6 text-lg font-bold text-primary">Order summary</h2>

              {/* What's unlocked */}
              <div className="mb-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                  Sections unlocked
                </p>
                <div className="space-y-2.5">
                  {UNLOCKED.map(({ icon: Icon, label, bg, color }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-3 rounded-xl border border-default ${bg} px-4 py-3`}
                    >
                      <Icon size={18} className={`shrink-0 ${color}`} strokeWidth={1.75} />
                      <span className="text-sm font-semibold text-primary">{label}</span>
                      <span className="ml-auto text-xs text-muted">Unlimited</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6 border-t border-default pt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                  Includes
                </p>
                <ul className="space-y-2.5">
                  {FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-muted">
                      <Check size={14} className="shrink-0 text-primary-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price summary */}
              <div className="border-t border-default pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">
                    Chronovah Pro · {billingPeriod === "yearly" ? "Yearly" : "Monthly"}
                  </span>
                  <span className="text-base font-bold text-primary">{amountFormatted}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted">Billed</span>
                  <span className="text-xs text-muted">
                    {billingPeriod === "yearly" ? "Once per year" : "Every month"}
                  </span>
                </div>
              </div>

              {/* Trust */}
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-default bg-default px-4 py-3">
                <ShieldCheck size={15} className="shrink-0 text-primary-500" />
                <p className="text-xs text-muted">
                  Secured by Paystack · PCI-DSS compliant
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
