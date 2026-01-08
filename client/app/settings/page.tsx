"use client";
import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Zap, Globe, Lock, LogOut, ChevronRight, Sparkles, Mail, Camera, Save } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';

export default function SettingsPage() {
    const router = useRouter();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Profile form state
    const [profileData, setProfileData] = useState({
        full_name: '',
        email: '',
        bio: ''
    });

    // Security form state
    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // AI Preferences state
    const [aiPrefs, setAiPrefs] = useState({
        aura: 'tactical',
        verbosity: 'high',
        precision: 85
    });

    // Ecosystem state
    const [ecoSettings, setEcoSettings] = useState({
        visibility: 'public',
        sharing: true,
        connectProtocol: 'open'
    });

    // Settings toggles
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                router.push('/login');
                return;
            }

            setUser(authUser);
            setProfileData({
                full_name: authUser.user_metadata?.full_name || '',
                email: authUser.email || '',
                bio: authUser.user_metadata?.bio || ''
            });

            // Load AI and Eco settings from metadata if they exist
            if (authUser.user_metadata?.ai_prefs) {
                setAiPrefs(authUser.user_metadata.ai_prefs);
            }
            if (authUser.user_metadata?.eco_settings) {
                setEcoSettings(authUser.user_metadata.eco_settings);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const handleSettingsUpdate = async (type: 'ai' | 'eco') => {
        setLoading(true);
        try {
            const updateData = type === 'ai'
                ? { ai_prefs: aiPrefs }
                : { eco_settings: ecoSettings };

            const { error } = await supabase.auth.updateUser({
                data: updateData
            });

            if (error) throw error;
            toast.success(`${type === 'ai' ? 'AI' : 'Ecosystem'} preferences synchronized!`);
            await loadUserData();
        } catch (error: any) {
            toast.error(error.message || 'Synchronization failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (securityData.newPassword !== securityData.confirmPassword) {
            toast.error('New passwords do not match');
            setLoading(false);
            return;
        }

        if (securityData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: securityData.newPassword
            });

            if (error) throw error;

            toast.success('Password updated successfully!');
            setSecurityData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error: any) {
            toast.error(error.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const tabs = [
        { id: 'profile', icon: User, label: 'Identity' },
        { id: 'security', icon: Lock, label: 'Security' },
        { id: 'intelligence', icon: Zap, label: 'AI Preferences' },
        { id: 'network', icon: Globe, label: 'Ecosystem' },
    ];

    return (
        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pt-32 pb-20 selection:bg-[#3d522b]/20">
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 mb-2">System Configuration</h1>
                    <p className="text-slate-500 font-medium">Manage your account preferences and security settings.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="md:col-span-4 space-y-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] border transition-all ${activeTab === tab.id
                                    ? 'bg-[#3d522b] border-[#3d522b] text-white shadow-xl shadow-[#3d522b]/20'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <tab.icon className="h-5 w-5" />
                                    <span className="font-bold uppercase tracking-widest text-xs">{tab.label}</span>
                                </div>
                                <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`} />
                            </button>
                        ))}

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 p-5 rounded-[1.5rem] border border-red-200 bg-white text-red-500 hover:bg-red-50 transition-all mt-8 shadow-sm"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="font-bold uppercase tracking-widest text-xs">Terminate Session</span>
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-8">
                        <div className="bg-white rounded-[3rem] p-10 md:p-14 min-h-[600px] border border-slate-200 shadow-sm">
                            {activeTab === 'profile' && (
                                <div className="animate-in fade-in slide-in-from-right-5 duration-500">
                                    <h2 className="text-2xl font-black uppercase tracking-tight mb-10 text-slate-900">Identity Settings</h2>
                                    <form className="space-y-8">
                                        <div className="flex items-center gap-8 mb-12 pb-12 border-b border-slate-100">
                                            <div className="h-24 w-24 bg-slate-100 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center relative group hover:bg-slate-200 transition-all cursor-pointer">
                                                <div className="h-full w-full rounded-full bg-[#3d522b]/10 flex items-center justify-center text-3xl font-black text-[#3d522b]">
                                                    {profileData.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <button type="button" className="absolute bottom-0 right-0 h-8 w-8 bg-[#3d522b] rounded-full border-4 border-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                                    <Camera className="h-3 w-3 text-white" />
                                                </button>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900 mb-2">Profile Avatar</h3>
                                                <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">JPG, PNG or GIF. Max 2MB.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    disabled
                                                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none text-slate-500 cursor-not-allowed"
                                                    placeholder="founder@growthory.ai"
                                                />
                                                <p className="text-[8px] text-slate-400 mt-1 ml-1 font-bold uppercase tracking-widest">Email cannot be changed</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Professional Bio</label>
                                            <textarea
                                                rows={4}
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-6 text-sm font-bold outline-none resize-none focus:border-[#3d522b] focus:bg-white transition-all text-slate-900 leading-relaxed"
                                                placeholder="Building the future of ecosystem intelligence..."
                                            />
                                        </div>

                                        <Button
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                setLoading(true);
                                                try {
                                                    const { error } = await supabase.auth.updateUser({
                                                        data: {
                                                            full_name: profileData.full_name,
                                                            bio: profileData.bio
                                                        }
                                                    });
                                                    if (error) throw error;
                                                    toast.success('Identity synchronized!');
                                                    await loadUserData();
                                                } catch (error: any) {
                                                    toast.error(error.message);
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            disabled={loading}
                                            className="px-10 py-4 bg-[#3d522b] text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#2d3d20] transition-all shadow-xl shadow-[#3d522b]/20 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <Sparkles className="h-4 w-4 animate-spin" /> Saving...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Save className="h-4 w-4" /> Save Changes
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="animate-in fade-in slide-in-from-right-5 duration-500">
                                    <h2 className="text-2xl font-black uppercase tracking-tight mb-10 text-slate-900">Security & Privacy</h2>
                                    <div className="space-y-8">
                                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100 transition-all">
                                            <div>
                                                <h4 className="font-bold uppercase tracking-widest text-xs mb-1 text-slate-900">Two-Factor Authentication</h4>
                                                <p className="text-slate-500 text-[10px] font-medium">Add an extra layer of security to your account.</p>
                                            </div>
                                            <button
                                                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                                className={`h-7 w-14 rounded-full relative shadow-lg transition-all ${twoFactorEnabled ? 'bg-[#3d522b]' : 'bg-slate-300'
                                                    }`}
                                            >
                                                <div className={`absolute top-1 h-5 w-5 bg-white rounded-full shadow-sm transition-all ${twoFactorEnabled ? 'right-1' : 'left-1'
                                                    }`}></div>
                                            </button>
                                        </div>

                                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100 transition-all">
                                            <div>
                                                <h4 className="font-bold uppercase tracking-widest text-xs mb-1 text-slate-900">Email Notifications</h4>
                                                <p className="text-slate-500 text-[10px] font-medium">Receive updates about matches and activity.</p>
                                            </div>
                                            <button
                                                onClick={() => setEmailNotifications(!emailNotifications)}
                                                className={`h-7 w-14 rounded-full relative shadow-lg transition-all ${emailNotifications ? 'bg-[#3d522b]' : 'bg-slate-300'
                                                    }`}
                                            >
                                                <div className={`absolute top-1 h-5 w-5 bg-white rounded-full shadow-sm transition-all ${emailNotifications ? 'right-1' : 'left-1'
                                                    }`}></div>
                                            </button>
                                        </div>

                                        <form onSubmit={handlePasswordChange} className="pt-8 border-t border-slate-100">
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 ml-1">Change Password</label>
                                            <div className="space-y-4">
                                                <input
                                                    type="password"
                                                    value={securityData.newPassword}
                                                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                                                    placeholder="New Password"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all text-slate-900"
                                                    required
                                                />
                                                <input
                                                    type="password"
                                                    value={securityData.confirmPassword}
                                                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                                    placeholder="Confirm New Password"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:border-[#3d522b] focus:bg-white transition-all text-slate-900"
                                                    required
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="mt-6 px-10 py-4 bg-[#3d522b] text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#606c38] transition-all shadow-xl shadow-[#3d522b]/20 disabled:opacity-50"
                                            >
                                                {loading ? 'Updating...' : 'Update Password'}
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'intelligence' && (
                                <div className="animate-in fade-in slide-in-from-right-5 duration-500">
                                    <h2 className="text-2xl font-black uppercase tracking-tight mb-10 text-slate-900">AI Intelligence Preferences</h2>
                                    <div className="space-y-10">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 ml-1">Engine Aura</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                {['tactical', 'visionary'].map((aura) => (
                                                    <button
                                                        key={aura}
                                                        onClick={() => setAiPrefs({ ...aiPrefs, aura })}
                                                        className={`p-6 rounded-2xl border-2 transition-all text-left ${aiPrefs.aura === aura
                                                            ? 'border-[#3d522b] bg-[#3d522b]/5'
                                                            : 'border-slate-100 bg-slate-50 hover:bg-slate-100'}`}
                                                    >
                                                        <div className={`text-xs font-black uppercase tracking-widest mb-1 ${aiPrefs.aura === aura ? 'text-[#3d522b]' : 'text-slate-600'}`}>
                                                            {aura}
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 font-medium">
                                                            {aura === 'tactical' ? 'Focus on execution and metrics.' : 'Focus on long-term scaling and strategy.'}
                                                        </p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-1">Semantic Match Precision ({aiPrefs.precision}%)</label>
                                            <input
                                                type="range"
                                                min="50"
                                                max="100"
                                                value={aiPrefs.precision}
                                                onChange={(e) => setAiPrefs({ ...aiPrefs, precision: parseInt(e.target.value) })}
                                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#3d522b]"
                                            />
                                            <div className="flex justify-between mt-2 text-[8px] font-black uppercase text-slate-400 tracking-widest">
                                                <span>Broad Match</span>
                                                <span>Laser Precision</span>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => handleSettingsUpdate('ai')}
                                            disabled={loading}
                                            className="w-full py-4 rounded-2xl"
                                        >
                                            Synchronize AI Nodes
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'network' && (
                                <div className="animate-in fade-in slide-in-from-right-5 duration-500">
                                    <h2 className="text-2xl font-black uppercase tracking-tight mb-10 text-slate-900">Ecosystem Visibility</h2>
                                    <div className="space-y-8">
                                        <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-200">
                                            <div className="flex items-center justify-between mb-8">
                                                <div>
                                                    <h4 className="font-bold uppercase tracking-widest text-xs mb-1 text-slate-900">Stealth Mode</h4>
                                                    <p className="text-slate-500 text-[10px] font-medium">Hide your node from global network searches.</p>
                                                </div>
                                                <button
                                                    onClick={() => setEcoSettings({ ...ecoSettings, visibility: ecoSettings.visibility === 'public' ? 'stealth' : 'public' })}
                                                    className={`h-7 w-14 rounded-full relative transition-all ${ecoSettings.visibility === 'stealth' ? 'bg-[#3d522b]' : 'bg-slate-300'}`}
                                                >
                                                    <div className={`absolute top-1 h-5 w-5 bg-white rounded-full shadow-sm transition-all ${ecoSettings.visibility === 'stealth' ? 'right-1' : 'left-1'}`}></div>
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-bold uppercase tracking-widest text-xs mb-1 text-slate-900">Metric Sharing</h4>
                                                    <p className="text-slate-500 text-[10px] font-medium">Allow investors to view your semantic growth scores.</p>
                                                </div>
                                                <button
                                                    onClick={() => setEcoSettings({ ...ecoSettings, sharing: !ecoSettings.sharing })}
                                                    className={`h-7 w-14 rounded-full relative transition-all ${ecoSettings.sharing ? 'bg-[#3d522b]' : 'bg-slate-300'}`}
                                                >
                                                    <div className={`absolute top-1 h-5 w-5 bg-white rounded-full shadow-sm transition-all ${ecoSettings.sharing ? 'right-1' : 'left-1'}`}></div>
                                                </button>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => handleSettingsUpdate('eco')}
                                            disabled={loading}
                                            className="w-full py-4 rounded-2xl"
                                        >
                                            Update Ecosystem Protocol
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
