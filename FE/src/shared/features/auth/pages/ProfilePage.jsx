import { useAuth } from "../hooks/useAuth";
import { User, Mail, Shield, Camera, CalendarDays } from "lucide-react";

export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) {
        return null; // The ProtectedRoute handles the redirect if not logged in
    }

    return (
        <div className="min-h-[80vh] bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h2>
                    <p className="mt-2 text-sm text-slate-600">Manage your account information and preferences</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-2xl">
                    <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
                    <div className="relative px-6 sm:px-12 pb-10">
                        <div className="flex justify-center -mt-20 mb-6">
                            <div className="relative group cursor-pointer">
                                <div className="h-36 w-36 rounded-full ring-8 ring-white bg-slate-100 overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50 text-indigo-500">
                                            <User size={64} />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Camera size={28} className="text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-10">
                            <h3 className="text-3xl font-bold text-slate-900">{user.fullName || "Unknown User"}</h3>
                            <div className="inline-flex items-center mt-3 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold tracking-wide border border-indigo-100 shadow-sm">
                                <Shield className="w-4 h-4 mr-1.5" />
                                {user.role || "Member"}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 flex items-start space-x-5 hover:bg-slate-50 transition-colors duration-200">
                                <div className="p-3.5 bg-white rounded-xl shadow-sm text-indigo-600 ring-1 ring-slate-100">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Email Address</p>
                                    <p className="text-lg font-semibold text-slate-900 mt-1">{user.email || "No email provided"}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 flex items-start space-x-5 hover:bg-slate-50 transition-colors duration-200">
                                <div className="p-3.5 bg-white rounded-xl shadow-sm text-indigo-600 ring-1 ring-slate-100">
                                    <User size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Full Name</p>
                                    <p className="text-lg font-semibold text-slate-900 mt-1">{user.fullName || "Not set"}</p>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 flex items-start space-x-5 hover:bg-slate-50 transition-colors duration-200 md:col-span-2">
                                <div className="p-3.5 bg-white rounded-xl shadow-sm text-indigo-600 ring-1 ring-slate-100">
                                    <CalendarDays size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Member Status</p>
                                    <p className="text-lg font-semibold text-slate-900 mt-1">Active User</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-center sm:justify-end border-t border-slate-100 pt-8">
                            <button className="px-8 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
