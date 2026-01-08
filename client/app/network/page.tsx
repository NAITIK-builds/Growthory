"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import {
    Search,
    Users,
    UserPlus,
    Globe,
    Filter,
    ArrowUpRight,
    Briefcase,
    Zap,
    TrendingUp,
    ShieldCheck,
    MapPin,
    Network as NetworkIcon,
    Loader2
} from 'lucide-react';

export default function NetworkPage() {
    const router = useRouter();
    const toast = useToast();
    const [user, setUser] = useState<any>(null);
    const [people, setPeople] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeRole, setActiveRole] = useState('all');
    const [tab, setTab] = useState('discover'); // discover, connections, pending

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

    const fetchPeople = async (query = '', role = 'all', userId = user?.id) => {
        setLoading(true);
        try {
            let url = `${API_URL}/network/explore?role=${role === 'all' ? '' : role}&searchQuery=${query}`;
            if (userId) url += `&currentUserId=${userId}`;
            const res = await fetch(url);
            const data = await res.json();
            setPeople(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch network error:", err);
            toast.error("Failed to sync with network nodes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setUser(session.user);
            fetchPeople('', 'all', session.user.id);
        };
        checkUser();
    }, [router]);

    const handleConnect = async (targetId: string, role: string) => {
        if (!user) return;

        try {
            const res = await fetch(`${API_URL}/network/connect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source_id: user.id,
                    target_id: targetId,
                    match_type: role === 'founder' ? 'investor_startup' : 'user_connection'
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Signal connection request transmitted.");
                // Update local state to show pending or remove
                setPeople(prev => prev.map(p => p.id === targetId ? { ...p, pending: true } : p));
            } else {
                toast.error(data.error || "Failed to connect");
            }
        } catch (err) {
            toast.error("Network synchronization lost");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pb-20 pt-24">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {/* Header & Stats Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                    <div className="lg:col-span-8">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Ecosystem Network</h1>
                        <p className="text-slate-500 font-medium">Discover and connect with the most promising nodes in the Growthory ecosystem.</p>
                    </div>
                    <div className="lg:col-span-4 flex items-center justify-end gap-3">
                        <div className="bg-white p-3 px-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3d522b]">Network Strength</span>
                            <span className="text-xl font-black text-slate-900">4,821 <span className="text-xs text-green-500">+12%</span></span>
                        </div>
                        <div className="bg-white p-3 px-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3d522b]">Active Nodes</span>
                            <span className="text-xl font-black text-slate-900">1,204</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Filters - Sidebar Style */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                                <Filter className="h-3 w-3" /> Filters
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#3d522b] block mb-2">Role Type</label>
                                    <div className="space-y-1">
                                        {[
                                            { id: 'all', label: 'All Clusters', icon: Globe },
                                            { id: 'founder', label: 'Founders', icon: Zap },
                                            { id: 'investor', label: 'Investors', icon: TrendingUp },
                                            { id: 'professional', label: 'Professionals', icon: Briefcase }
                                        ].map((r) => (
                                            <button
                                                key={r.id}
                                                onClick={() => { setActiveRole(r.id); fetchPeople(searchQuery, r.id); }}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm ${activeRole === r.id ? 'bg-[#3d522b] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                <r.icon className={`h-4 w-4 ${activeRole === r.id ? 'text-white' : 'text-slate-400'}`} />
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#3d522b] block mb-2">Location Signal</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3d522b]/20">
                                        <option>Global Network</option>
                                        <option>Silicon Valley Hub</option>
                                        <option>London Tech Node</option>
                                        <option>Bangalore Ecosystem</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#3d522b] rounded-2xl p-6 text-white overflow-hidden relative group">
                            <div className="relative z-10">
                                <ShieldCheck className="h-8 w-8 mb-4 text-green-400" />
                                <h4 className="text-lg font-bold mb-2">Premium Network</h4>
                                <p className="text-sm text-green-100/80 mb-6 font-medium">Unlock verified investor signals and direct routing to tier-1 founders.</p>
                                <Button className="w-full bg-white text-[#3d522b] hover:bg-green-50 rounded-xl font-black text-xs uppercase tracking-widest">
                                    Upgrade Signal
                                </Button>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <NetworkIcon size={120} />
                            </div>
                        </div>
                    </div>

                    {/* Right Results Grid */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* Search & Tabs */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 flex flex-col md:flex-row gap-2">
                            <div className="flex-grow relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, expertise, or vision..."
                                    className="w-full bg-transparent border-none focus:ring-0 pl-11 pr-4 py-3 text-sm font-medium"
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); fetchPeople(e.target.value, activeRole); }}
                                />
                            </div>
                            <div className="flex p-1 bg-slate-50 rounded-xl">
                                {[
                                    { id: 'discover', label: 'Discover' },
                                    { id: 'connections', label: 'Connections' },
                                    { id: 'pending', label: 'Requests' }
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTab(t.id)}
                                        className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${tab === t.id ? 'bg-white shadow-sm text-[#3d522b]' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* People Feed */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                <Loader2 className="h-10 w-10 text-[#3d522b] animate-spin mb-4" />
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Scanning Ecosystem Nodes...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {people.length > 0 ? people.map((person) => (
                                    <div key={person.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:border-[#3d522b]/30 transition-all group">
                                        <div className="h-16 bg-slate-50 relative">
                                            <div className="absolute -bottom-8 left-6">
                                                <div className="h-16 w-16 rounded-2xl bg-white p-1 shadow-md border border-slate-100">
                                                    <div className="h-full w-full rounded-xl bg-[#3d522b]/5 flex items-center justify-center text-xl font-black text-[#3d522b]">
                                                        {person.full_name?.[0].toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-10">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3
                                                        className="font-bold text-slate-900 group-hover:text-[#3d522b] transition-colors cursor-pointer hover:underline"
                                                        onClick={() => router.push(`/profile/${person.id}`)}
                                                    >
                                                        {person.full_name}
                                                    </h3>
                                                    <p className="text-[10px] font-black text-[#3d522b] uppercase tracking-widest">{person.role}</p>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2 h-8 italic">
                                                {person.details || 'Building the future of the ecosystem.'}
                                            </p>

                                            <div className="flex items-center gap-2 mb-6">
                                                <MapPin className="h-3 w-3 text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Remote Cluster</span>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => !person.connected && handleConnect(person.id, person.role)}
                                                    variant={person.connected ? 'outline' : person.pending ? 'outline' : 'primary'}
                                                    disabled={person.pending || person.connected}
                                                    className={`flex-grow rounded-xl h-10 text-[10px] font-black uppercase tracking-widest py-0 ${person.connected ? 'border-[#3d522b]/30 text-[#3d522b] bg-[#3d522b]/5' : person.pending ? 'border-slate-200 text-slate-400' : 'bg-[#3d522b]'}`}
                                                >
                                                    {person.connected ? 'Connected' : person.pending ? 'Request Sent' : (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <UserPlus className="h-3 w-3" /> Connect
                                                        </span>
                                                    )}
                                                </Button>
                                                <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-[#3d522b] hover:bg-[#3d522b]/5 transition-all">
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                        <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">No Nodes Isolated</h3>
                                        <p className="text-slate-500 text-sm max-w-xs mx-auto">Try adjusting your filters or search signal to discover more nodes.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pagination / Load More */}
                        {!loading && people.length > 0 && (
                            <div className="flex justify-center pt-8">
                                <button className="px-8 py-3 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-[#3d522b] hover:border-[#3d522b]/30 transition-all shadow-sm">
                                    Load More Signal
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
