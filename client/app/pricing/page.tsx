"use client";
import React, { useState } from 'react';
import { Zap, Check, Sparkles, Rocket, Globe, Shield, Star, TrendingUp, Users, Crown } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

    const plans = [
        {
            name: 'Pulse',
            subtitle: 'Free Forever',
            price: { monthly: 0, annual: 0 },
            icon: Rocket,
            color: 'slate',
            features: [
                'Basic Semantic Profile',
                'Core Ecosystem Directory',
                'Limited AI Pitch Feedback',
                'Secure Messaging (3/mo)',
                'Community Access'
            ],
            cta: 'Join Network',
            popular: false
        },
        {
            name: 'Velocity',
            subtitle: 'Most Popular',
            price: { monthly: 49, annual: 470 },
            icon: Zap,
            color: 'olive',
            features: [
                'Advanced Vector Mapping',
                'Unlimited AI Pitch Iterations',
                'Priority Match Stream',
                'Full Network Visibility',
                'Growth Analytics Portal',
                'Investor Intro Credits (10/mo)',
                'Premium Support'
            ],
            cta: 'Upgrade to Velocity',
            popular: true
        },
        {
            name: 'Capital',
            subtitle: 'For VCs & Funds',
            price: { monthly: 299, annual: 2870 },
            icon: Crown,
            color: 'amber',
            features: [
                'Proprietary Deal Flow Engine',
                'Custom Thesis Integration',
                'API Access (Vector Maps)',
                'Verified Talent Pipelines',
                'Dedicated Account Manager',
                'White-label Solutions',
                'Unlimited Team Seats'
            ],
            cta: 'Contact Sales',
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pt-32 pb-20 selection:bg-[#3d522b]/20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-[#3d522b] text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                        <TrendingUp className="h-3 w-3" /> Transparent Pricing
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 uppercase text-slate-900 leading-none">
                        Capital Infrastructure
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        Precision matching shouldn't be a privilege. Choose the tier that matches your growth velocity.
                    </p>

                    {/* Billing Toggle */}
                    <div className="mt-12 inline-flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly'
                                    ? 'bg-[#3d522b] text-white shadow-lg shadow-[#3d522b]/20'
                                    : 'text-slate-400 hover:text-slate-900'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('annual')}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${billingCycle === 'annual'
                                    ? 'bg-[#3d522b] text-white shadow-lg shadow-[#3d522b]/20'
                                    : 'text-slate-400 hover:text-slate-900'
                                }`}
                        >
                            Annual
                            <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-500 text-white rounded-full text-[8px] font-black">
                                SAVE 20%
                            </span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`bg-white rounded-[3rem] p-10 flex flex-col relative border shadow-sm hover:shadow-xl transition-all duration-500 ${plan.popular
                                    ? 'border-[#3d522b] shadow-[#3d522b]/10 scale-105'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-8 -translate-y-1/2 px-6 py-2 rounded-full bg-[#3d522b] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#3d522b]/30">
                                    <Star className="h-3 w-3 inline mr-1" /> Most Adopted
                                </div>
                            )}

                            <div className="mb-10">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${plan.color === 'olive' ? 'bg-[#3d522b]' :
                                        plan.color === 'amber' ? 'bg-amber-500' :
                                            'bg-slate-100'
                                    } shadow-lg`}>
                                    <plan.icon className={`h-7 w-7 ${plan.color === 'slate' ? 'text-slate-400' : 'text-white'
                                        }`} />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-slate-900">
                                    {plan.name}
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                                    {plan.subtitle}
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-slate-900">
                                        ${billingCycle === 'monthly' ? plan.price.monthly : Math.floor(plan.price.annual / 12)}
                                    </span>
                                    <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                                        {plan.price.monthly === 0 ? 'Forever' : '/ Month'}
                                    </span>
                                </div>
                                {billingCycle === 'annual' && plan.price.annual > 0 && (
                                    <p className="text-xs text-slate-400 font-bold mt-2">
                                        ${plan.price.annual} billed annually
                                    </p>
                                )}
                            </div>

                            <ul className="space-y-4 mb-10 flex-grow">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-start gap-3 text-slate-600 font-medium text-sm">
                                        <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-[#3d522b]' : 'text-slate-400'
                                            }`} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link href="/signup" className="mt-auto">
                                <Button
                                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${plan.popular
                                            ? 'bg-[#3d522b] text-white hover:bg-[#606c38] shadow-xl shadow-[#3d522b]/20'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                                        }`}
                                >
                                    {plan.cta}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Trust Section */}
                <div className="bg-white rounded-[4rem] p-16 border border-slate-200 shadow-sm text-center mb-20">
                    <Shield className="h-12 w-12 text-[#3d522b] mx-auto mb-8" />
                    <h3 className="text-3xl font-black uppercase tracking-tight mb-6 text-slate-900">Bank-Grade Security</h3>
                    <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed font-medium">
                        Growthory utilizes end-to-end vector encryption (E2EVE) and strict data sovereignty protocols.
                        Your intellectual property is safe in our ecosystem.
                    </p>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-black uppercase tracking-tight text-center mb-12 text-slate-900">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: 'Can I switch plans anytime?',
                                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
                            },
                            {
                                q: 'What payment methods do you accept?',
                                a: 'We accept all major credit cards, PayPal, and wire transfers for enterprise plans.'
                            },
                            {
                                q: 'Is there a free trial for paid plans?',
                                a: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start.'
                            },
                            {
                                q: 'What happens to my data if I cancel?',
                                a: 'Your data remains accessible for 30 days after cancellation. You can export it anytime.'
                            }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                                <h4 className="text-base font-black uppercase tracking-tight text-slate-900 mb-3">
                                    {faq.q}
                                </h4>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
