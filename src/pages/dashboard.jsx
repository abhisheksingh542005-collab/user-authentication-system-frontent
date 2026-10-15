import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/userslice.js";
import { 
  LogOut, 
  UserCheck, 
  Shield, 
  Key, 
  Mail, 
  Calendar, 
  Activity, 
  User, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Lock 
} from "lucide-react";
import API from "../api/axios";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // States for Profile Update
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profileMsg, setProfileMsg] = useState("");

  // States for Password Change
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passMsg, setPassMsg] = useState("");

  // States for Notes CRUD
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Sync state if Redux user updates
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
    }
  }, [user]);

  // Fetch Notes on Component Load
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers
  // 1. Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await API.put("/update-profile", { name, bio }); // 👈 Yahan `/user/update-profile` ki jagah sirf `/update-profile` rakho
      setProfileMsg({ text: "Profile updated successfully! ✅", isError: false });
    } catch (err) {
      setProfileMsg({ text: "Failed to update profile. ❌", isError: true });
    }
  };

  // 2. Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await API.put("/change-password", { oldPassword, newPassword }); // 👈 Yahan bhi sirf `/change-password` rakho
      setPassMsg({ text: "Password changed successfully! ✅", isError: false });
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setPassMsg({ text: "Invalid current password! ❌", isError: true });
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    try {
      const res = await API.post("/notes", { title, content });
      setNotes([res.data, ...notes]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-200 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Navigation Bar */}
        <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
              <UserCheck className="h-7 w-7 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Overview Dashboard</h1>
              <p className="text-sm text-slate-400 flex items-center gap-1">
                Logged in as <span className="text-indigo-400 font-medium">{user?.email || "User"}</span>
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl transition duration-200 font-medium text-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Settings & Notes */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Edit Profile Card */}
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Edit3 className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">Edit Profile Details</h2>
              </div>

              {profileMsg && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Bio / Status</label>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="MERN Stack Developer"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition text-sm shadow-lg shadow-indigo-600/20"
                >
                  Save Profile Updates
                </button>
              </form>
            </div>

            {/* Personal Notes CRUD Section */}
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Activity className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">Personal Protected Notes</h2>
              </div>

              {/* Note Create Form */}
              <form onSubmit={handleAddNote} className="space-y-3 mb-6">
                <input
                  type="text"
                  placeholder="Note Title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
                <textarea
                  placeholder="Note Content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="3"
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2.5 rounded-xl transition text-sm shadow-lg shadow-emerald-600/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Note</span>
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {notes.length === 0 ? (
                  <p className="text-slate-500 text-sm italic">No personal notes created yet.</p>
                ) : (
                  notes.map((note) => (
                    <div key={note._id} className="bg-[#0d1117] p-4 rounded-xl border border-slate-800 flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-semibold text-indigo-300 text-sm">{note.title}</h3>
                        <p className="text-slate-400 text-xs mt-1">{note.content}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="text-red-400 hover:text-red-300 p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Column 3: Security & Change Password */}
          <div className="space-y-6">
            
            {/* Account Info Card */}
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">Session Credentials</h2>
              </div>
              <div className="space-y-3 text-xs">
                <div className="bg-[#0d1117] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">ACCOUNT ID</span>
                  <span className="text-slate-300 font-mono">{user?._id || "N/A"}</span>
                </div>
                <div className="bg-[#0d1117] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">COOKIE TOKEN</span>
                  <span className="text-emerald-400 font-medium">HttpOnly Secure Cookie</span>
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Lock className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">Security</h2>
              </div>

              {passMsg && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{passMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2.5 rounded-xl border border-slate-700 transition text-sm"
                >
                  Update Password
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;