import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../redux/userslice.js";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, User, Eye, EyeOff, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearError());
    if (user) navigate("/dashboard");
  }, [user, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (localError) setLocalError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    dispatch(registerUser({ name: formData.name, email: formData.email, password: formData.password }));
  };

  // Password Strength Score
  const getPasswordStrength = () => {
    const pass = formData.password;
    if (!pass) return { label: "", color: "" };
    if (pass.length < 6) return { label: "Weak", color: "bg-red-500", width: "w-1/3" };
    if (pass.length >= 6 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
      return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
    }
    return { label: "Medium", color: "bg-yellow-500", width: "w-2/3" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#161b22]/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-semibold tracking-wide uppercase mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Join Our Platform</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-slate-400 text-sm mt-2">Start your journey with us in less than a minute</p>
        </div>

        {/* Error Alert */}
        {(error || localError) && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center space-x-3 text-red-400 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold tracking-wider uppercase mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Abhishek Singh"
                className="w-full pl-12 pr-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold tracking-wider uppercase mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="abhishek@example.com"
                className="w-full pl-12 pr-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold tracking-wider uppercase mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full pl-12 pr-12 py-3 bg-[#0d1117] border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Strength Meter Bar */}
            {formData.password && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span>Password Strength</span>
                  <span className="font-semibold text-slate-300">{strength.label}</span>
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold tracking-wider uppercase mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full pl-12 pr-4 py-3 bg-[#0d1117] border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <CheckCircle2 className="absolute right-4 top-3.5 h-5 w-5 text-emerald-500" />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Register Account</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;