"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useState } from "react";

const faqsData = [
    {
        section: "Your Account",
        items: [
            {
                q: "Donec in ipsum sit amet mi tincidunt lacinia ut id risus.",
                a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pretium lacus ac ex tempus, sed dictum libero lacinia. Cras velit mauris, venenatis vel posuere at, scelerisque sed eros.",
            },
            {
                q: "Etiam rutrum ligula at dui tempor, eu tempus ligula tristique.",
                a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
            {
                q: "Morbi vitae neque eu sapien aliquet rhoncus.",
                a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
        ],
    },
    {
        section: "Employers and Jobs",
        items: [
            {
                q: "Donec in ipsum sit amet mi tincidunt lacinia ut id risus.",
                a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
            {
                q: "Etiam rutrum ligula at dui tempor, eu tempus ligula tristique.",
                a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
            {
                q: "Morbi vitae neque eu sapien aliquet rhoncus.",
                a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
        ],
    },
    {
        section: "Candidate & Resume",
        items: [
            {
                q: "Donec in ipsum sit amet mi tincidunt lacinia ut id risus.",
                a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
            {
                q: "Etiam rutrum ligula at dui tempor, eu tempus ligula tristique.",
                a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
            {
                q: "Morbi vitae neque eu sapien aliquet rhoncus.",
                a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
        ],
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (id) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white">
                {/* Header */}
                <div className="border-b">
                    <div className="max-w-5xl mx-auto px-4 py-6 flex justify-between text-sm text-gray-500">
                        <h1 className="font-medium text-gray-700">Contact</h1>
                        <span>Home / Contact</span>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">
                    {faqsData.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                {section.section}
                            </h2>

                            <div className="space-y-4">
                                {section.items.map((item, itemIndex) => {
                                    const id = `${sectionIndex}-${itemIndex}`;
                                    const isOpen = openIndex === id;

                                    return (
                                        <div key={id} className="relative">
                                            {/* Question */}
                                            <button
                                                onClick={() => toggle(id)}
                                                className="w-full flex items-center justify-between rounded-md border border-gray-200 bg-white px-5 py-4 text-left text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
                                            >
                                                {item.q}
                                                <span className="text-xl text-gray-400">
                                                    {isOpen ? "×" : "+"}
                                                </span>
                                            </button>

                                            {/* Answer */}
                                            {isOpen && (
                                                <div className="absolute left-0 right-0 z-10 mt-2 rounded-md border border-gray-200 bg-white p-5 text-sm text-gray-600 shadow-lg">
                                                    {item.a}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer/>
        </>
    );
}
