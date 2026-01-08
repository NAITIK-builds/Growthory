"use client";
import React from 'react';
import { Rocket, Zap, Target, Briefcase, Shield, Cpu, Sparkles, Globe, ArrowRight, TrendingUp, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function FeaturesPage() {
    const features = [
        {
            title: 'Semantic Mapping',
            desc: 'Our AI analyzes the multi-dimensional DNA of your startup, matching you with investors whose thesis aligns with your core vision.',
            icon: Cpu,
            tags: ['Vector Analysis', 'Thesis Mapping']
        },
        {
            title: 'Pitch Optimization',
            desc: 'Upload your deck and receive real-time, AI-driven tactical feedback on appeal, market positioning, and pitch clarity.',
            icon: Zap,
            tags: ['Real-time', 'AI-Driven']
        },
        {
            title: 'Capital Matching',
            desc: 'Sophisticated algorithms ensure investors only see deals that match their investment criteria, reducing noise to zero.',
            icon: Target,
            tags: ['Precision', 'Automated']
        },
        {
            title: 'Talent Discovery',
            desc: 'Connect with vetted professionals actively seeking growth-stage opportunities in your sector.',
            icon: Briefcase,
            tags: ['Verified', 'Curated']
        },
        {
            title: 'Trust Protocol',
            desc: 'A verified network where every player is vetted. We create a secure environment for high-stakes deals.',
            icon: Shield,
            tags: ['Verified', 'Secure']
        },
        {
            title: 'Global Network',
            desc: 'Connecting ecosystems across borders. Growthory democratizes access to opportunity, no matter where you are.',
            icon: Globe,
            tags: ['Worldwide', 'Borderless']
        },
        {
            title: 'Market Intelligence',
            desc: 'Real-time analytics on sector trends, funding velocity, and competitive landscape insights.',
            icon: BarChart3,
            tags: ['Analytics', 'Insights']
        },
        {
            title: 'Growth Tracking',
            desc: 'Monitor your startup\'s performance metrics, investor engagement, and network expansion in real-time.',
            icon: TrendingUp,
            tags: ['Metrics', 'Dashboard']
        },
        {
            title: 'Community Access',
            desc: 'Join exclusive events, workshops, and networking sessions with top-tier founders and investors.',
            icon: Users,
            tags: ['Events', 'Networking']
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pt-32 pb-20 selection:bg-[#3d522b]/20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-[#3d522b] text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                        <Sparkles className="h-3 w-3" /> Platform Capabilities
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 uppercase text-slate-900 leading-none">
                        Ecosystem Features
                    </h1>
                    <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
                        Growthory builds the infrastructure for the next generation of venture matching.
                        Powered by proprietary semantic intelligence and real-time market data.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {features.map((feature, i) => (
                        <div key={i} className="group bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-[#3d522b]/5 hover:border-[#3d522b]/30 transition-all duration-500 flex flex-col">
                            <div className="h-16 w-16 bg-[#3d522b]/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#3d522b] transition-all duration-500 shadow-sm border border-slate-100">
                                <feature.icon className="h-8 w-8 text-[#3d522b] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-slate-900 group-hover:text-[#3d522b] transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium flex-grow">
                                {feature.desc}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {feature.tags.map((tag, j) => (
                                    <span key={j} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-[#3d522b]/10 group-hover:text-[#3d522b] transition-colors">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="bg-[#3d522b] rounded-[4rem] p-16 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-[#3d522b]/20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <Sparkles className="h-16 w-16 text-white mx-auto mb-8 animate-pulse" />
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-8 uppercase tracking-tight leading-tight">
                            Ready to Scale Your Venture?
                        </h2>
                        <p className="text-lg text-white/70 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                            Join thousands of founders, investors, and experts building the future on Growthory's unified platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link href="/signup">
                                <Button size="lg" className="bg-white text-[#3d522b] hover:bg-slate-100 px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl">
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link href="/pricing">
                                <Button size="lg" className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em]">
                                    View Pricing <ArrowRight className="ml-3 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
