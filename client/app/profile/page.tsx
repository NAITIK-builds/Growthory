"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { User, Mail, Briefcase, MapPin, Calendar, Edit, Save, ArrowLeft, Shield, TrendingUp, Award, Target, Sparkles, Rocket, Building2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';

export default function ProfilePage() {
    const router = useRouter();
    const toast = useToast();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState({
        full_name: '',
        bio: '',
        role: '',
        location: '',
        company: ''
    });
    const [myStartup, setMyStartup] = useState<any>(null);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                router.push('/login');
                return;
            }

            setUser(authUser);
            setProfileData({
                full_name: authUser.user_metadata?.full_name || '',
                bio: authUser.user_metadata?.bio || '',
                role: authUser.user_metadata?.role || 'founder',
                location: authUser.user_metadata?.location || '',
                company: authUser.user_metadata?.company || ''
            });

            // Fetch startup if founder
            if (authUser.user_metadata?.role === 'founder') {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
                const res = await fetch(`${API_URL}/startups`);
                const startups = await res.json();
                if (Array.isArray(startups)) {
                    const mine = startups.find((s: any) => s.founder_id === authUser.id);
                    setMyStartup(mine);
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: profileData
            });

            if (error) throw error;

            toast.success('Profile updated successfully!');
            await loadUserProfile();
            setEditing(false);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8faf7] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d522b]"></div>
            </div>
        );
    }

    const joinedDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown';

    return (
        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pt-32 pb-20 px-6 selection:bg-[#3d522b]/20">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <button onClick={() => router.push('/dashboard')} className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm group">
                            <ArrowLeft className="h-6 w-6 text-slate-400 group-hover:text-[#3d522b] transition-colors" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 leading-none">My Profile</h1>
                            <p className="text-slate-500 font-medium mt-1">Manage your public identity</p>
                        </div>
                    </div>
                    {!editing ? (
                        <Button
                            onClick={() => setEditing(true)}
                            className="px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest"
                        >
                            <Edit className="h-4 w-4 mr-2" /> Edit Profile
                        </Button>
                    ) : (
                        <div className="flex gap-3">
                            <Button
                                onClick={() => setEditing(false)}
                                variant="secondary"
                                className="px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[#3d522b]/20 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : <><Save className="h-4 w-4 mr-2" /> Save</>}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-sm text-center sticky top-32">
                            <div className="h-32 w-32 mx-auto rounded-full bg-[#3d522b]/10 border-4 border-white shadow-xl flex items-center justify-center text-5xl font-black text-[#3d522b] mb-6">
                                {profileData.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                                {profileData.full_name || 'User'}
                            </h2>
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-6">
                                {profileData.role}
                            </p>

                            <div className="space-y-4 text-left">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600 font-medium truncate">{user?.email}</span>
                                </div>
                                {profileData.location && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="h-4 w-4 text-slate-400" />
                                        <span className="text-slate-600 font-medium">{profileData.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600 font-medium">Joined {joinedDate}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-black text-[#3d522b]">12</div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connections</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-[#3d522b]">95%</div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Score</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Profile Details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* About Section */}
                        <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3">
                                <User className="h-5 w-5 text-[#3d522b]" /> About
                            </h3>
                            {editing ? (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileData.full_name}
                                            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all text-slate-900"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Bio</label>
                                        <textarea
                                            rows={4}
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-6 text-sm font-bold outline-none resize-none focus:border-[#3d522b] focus:bg-white transition-all text-slate-900 leading-relaxed"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Location</label>
                                            <input
                                                type="text"
                                                value={profileData.location}
                                                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all text-slate-900"
                                                placeholder="San Francisco, CA"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Company</label>
                                            <input
                                                type="text"
                                                value={profileData.company}
                                                onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all text-slate-900"
                                                placeholder="Growthory Inc."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {profileData.bio || 'No bio added yet. Click "Edit Profile" to add one.'}
                                    </p>
                                    {(profileData.location || profileData.company) && (
                                        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                                            {profileData.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-slate-400" />
                                                    <span className="text-sm font-bold text-slate-600">{profileData.location}</span>
                                                </div>
                                            )}
                                            {profileData.company && (
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4 text-slate-400" />
                                                    <span className="text-sm font-bold text-slate-600">{profileData.company}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Startup Section (If Founder) */}
                        {profileData.role === 'founder' && (
                            <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm overflow-hidden relative transition-all hover:border-[#3d522b]/30">
                                <div className="absolute top-0 right-0 p-8">
                                    <Rocket className="h-12 w-12 text-[#3d522b]/10 -rotate-12" />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-3">
                                    <Building2 className="h-5 w-5 text-[#3d522b]" /> Managed Venture
                                </h3>

                                {myStartup ? (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <div>
                                            <h4 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tight">{myStartup.name}</h4>
                                            <p className="text-sm text-[#3d522b] font-bold uppercase tracking-widest italic">{myStartup.tagline}</p>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed font-medium">
                                            {myStartup.description_raw}
                                        </p>
                                        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                                            <span className="px-4 py-1.5 bg-[#3d522b]/5 text-[#3d522b] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#3d522b]/10">{myStartup.industry}</span>
                                            <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">{myStartup.stage}</span>
                                            {myStartup.startup_analysis?.[0] && (
                                                <div className="ml-auto flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                                    <TrendingUp className="h-3 w-3" /> Signal Score: {myStartup.startup_analysis[0].investor_appeal_score}%
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-slate-400 text-sm font-medium mb-6">No venture associated with this node yet.</p>
                                        <Button
                                            onClick={() => router.push('/startups/create')}
                                            variant="secondary"
                                            className="rounded-xl px-6"
                                        >
                                            Register Startup
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Activity Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm text-center">
                                <Target className="h-8 w-8 text-[#3d522b] mx-auto mb-3" />
                                <div className="text-2xl font-black text-slate-900 mb-1">5</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Matches</div>
                            </div>
                            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm text-center">
                                <TrendingUp className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                                <div className="text-2xl font-black text-slate-900 mb-1">87%</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Strength</div>
                            </div>
                            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm text-center">
                                <Award className="h-8 w-8 text-[#3d522b] mx-auto mb-3" />
                                <div className="text-2xl font-black text-slate-900 mb-1">3</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Achievements</div>
                            </div>
                        </div>

                        {/* Verification Badge */}
                        <div className="bg-[#3d522b] rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10 flex items-center gap-6">
                                <Shield className="h-12 w-12 text-white" />
                                <div>
                                    <h4 className="text-lg font-black uppercase tracking-tight mb-2">Verified Identity</h4>
                                    <p className="text-white/70 text-sm font-medium">Your profile is verified and trusted by the Growthory ecosystem.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

