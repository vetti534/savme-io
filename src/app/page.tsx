'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FaSearch, FaCheckCircle, FaBolt, FaLock,
  FaFilePdf, FaCalculator, FaImage, FaChevronRight,
  FaCompressArrowsAlt, FaFileWord, FaEraser, FaPercentage,
  FaChartPie, FaExpand, FaCut, FaObjectGroup, FaFileExcel,
  FaFire, FaGlobe, FaRobot
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

// Note: Metadata export is not allowed in 'use client' components.
// We should move metadata to layout or a separate server component wrapper if strictly needed here.
// For now, removing 'export const metadata' to avoid build error in client component.

export default function Home() {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">

      {/* ---------------- SECTION 11.1: AD SLOT (Under Header) ---------------- */}
      <div className="bg-gray-50 py-4 border-b border-gray-100 flex justify-center">
        <div className="w-[728px] h-[90px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-300">
          Advertisement Slot (728x90)
        </div>
      </div>

      {/* ---------------- SECTION 2: HERO SECTION ---------------- */}
      <section className="relative pt-20 pb-24 overflow-hidden bg-white">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.15]">
            All Tools You Need — <span className="text-red-600">In One Place.</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto font-medium">
            PDF • Calculators • Images • AI Tools — Fast, Free & Secure.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-10 group">
            <div className="absolute inset-0 bg-red-200 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative flex items-center bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 h-16 px-6">
              <FaSearch className="text-gray-400 text-xl mr-4" />
              <input
                type="text"
                placeholder="Search 500+ Tools..."
                className="flex-1 bg-transparent border-none outline-none text-lg text-gray-800 placeholder-gray-400 h-full"
              />
              <button className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors shadow-md">
                Search
              </button>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <QuickActionBtn label="PDF Tools" href="/categories/pdf-tools" icon={<FaFilePdf />} color="text-red-600 bg-red-50 hover:bg-red-100 border-red-100" />
            <QuickActionBtn label="Finance" href="/categories/finance-money" icon={<FaCalculator />} color="text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-100" />
            <QuickActionBtn label="Image Tools" href="/categories/image-tools" icon={<FaImage />} color="text-green-600 bg-green-50 hover:bg-green-100 border-green-100" />
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 3: VALUE PROPOSITION ---------------- */}
      <section className="py-12 border-y border-gray-50 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ValueBox icon={<FaBolt className="text-yellow-500 text-2xl" />} title="Super Fast Tools" />
            <ValueBox icon={<MdVerified className="text-blue-500 text-2xl" />} title="100% Free" />
            <ValueBox icon={<FaCheckCircle className="text-green-500 text-2xl" />} title="No Login Required" />
            <ValueBox icon={<FaLock className="text-gray-700 text-2xl" />} title="Secure & Private" />
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 4: POPULAR TOOLS GRID + AD ---------------- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle title="Popular Tools" />
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <ToolCard title="PDF Compress" desc="Reduce size efficiently" icon={<FaCompressArrowsAlt />} color="text-red-500" href="/tools/compress-pdf" />
            <ToolCard title="PDF to Word" desc="Convert PDF to editable doc" icon={<FaFileWord />} color="text-blue-600" href="/tools/pdf-to-word" />
            <ToolCard title="JPG to PNG" desc="Convert image format" icon={<FaImage />} color="text-purple-500" href="/tools/jpg-to-png" />
            <ToolCard title="Remove BG" desc="Transparent background" icon={<FaEraser />} color="text-gray-600" href="/tools/remove-background" />
            <ToolCard title="EMI Calculator" desc="Calculate loan EMI" icon={<FaCalculator />} color="text-green-600" href="/tools/emi-calculator" />
            <ToolCard title="GST Calculator" desc="India GST rates" icon={<FaPercentage />} color="text-orange-500" href="/tools/gst-calculator" />
            <ToolCard title="SIP Calculator" desc="Investment planning" icon={<FaChartPie />} color="text-indigo-600" href="/tools/sip-calculator" />
            <ToolCard title="PDF Merge" desc="Combine multiple PDFs" icon={<FaObjectGroup />} color="text-red-600" href="/tools/merge-pdf" />
            <ToolCard title="Image Resize" desc="Resize pixels/cm" icon={<FaExpand />} color="text-cyan-500" href="/tools/image-resizer" />
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 5: AI TOOLS SHOWCASE ---------------- */}
      <section className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold mb-4 text-purple-200 shadow-lg">
              ✨ Next Generation Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">AI Tools to Make Your Work Smarter</h2>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">Enhance your productivity with our suite of free Artificial Intelligence tools.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <AiFeatureCard title="AI PDF Summarizer" icon={<FaFilePdf />} />
            <AiFeatureCard title="AI Calculator Advisor" icon={<FaRobot />} />
            <AiFeatureCard title="AI SEO Text Writer" icon={<FaBolt />} />
            <AiFeatureCard title="AI Photo Enhancer" icon={<FaImage />} />
            <AiFeatureCard title="AI Invoice Generator" icon={<FaFileExcel />} />
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 6: PDF TOOLS MINI GRID ---------------- */}
      <MiniGridSection title="PDF Tools" seeAllLink="/categories/pdf-tools">
        <MiniToolCard name="PDF Merge" icon={<FaObjectGroup className="text-red-500" />} href="/tools/merge-pdf" />
        <MiniToolCard name="PDF Split" icon={<FaCut className="text-red-500" />} href="/tools/split-pdf" />
        <MiniToolCard name="PDF Compress" icon={<FaCompressArrowsAlt className="text-red-500" />} href="/tools/compress-pdf" />
        <MiniToolCard name="PDF to Word" icon={<FaFileWord className="text-red-500" />} href="/tools/pdf-to-word" />
        <MiniToolCard name="Word to PDF" icon={<FaFilePdf className="text-red-500" />} href="/tools/word-to-pdf" />
        <MiniToolCard name="PDF Protect" icon={<FaLock className="text-red-500" />} href="/tools/protect-pdf" />
      </MiniGridSection>

      {/* ---------------- SECTION 7: CALCULATORS MINI GRID ---------------- */}
      <MiniGridSection title="Calculator Tools" seeAllLink="/categories/finance-money" bg="bg-gray-50">
        <MiniToolCard name="EMI Calculator" icon={<FaCalculator className="text-blue-500" />} href="/tools/emi-calculator" />
        <MiniToolCard name="GST Calculator" icon={<FaPercentage className="text-blue-500" />} href="/tools/gst-calculator" />
        <MiniToolCard name="Income Tax" icon={<FaFileExcel className="text-blue-500" />} href="/tools/income-tax-calculator" />
        <MiniToolCard name="Age Calculator" icon={<FaFire className="text-blue-500" />} href="/tools/age-calculator" />
        <MiniToolCard name="Percentage" icon={<FaPercentage className="text-blue-500" />} href="/tools/percentage-calculator" />
        <MiniToolCard name="BMI Calculator" icon={<FaCheckCircle className="text-blue-500" />} href="/tools/bmi-calculator" />
      </MiniGridSection>

      {/* ---------------- SECTION 8: IMAGE TOOLS MINI GRID ---------------- */}
      <MiniGridSection title="Image Tools" seeAllLink="/categories/image-tools">
        <MiniToolCard name="Image Resize" icon={<FaExpand className="text-green-500" />} href="/tools/image-resizer" />
        <MiniToolCard name="Compress Image" icon={<FaCompressArrowsAlt className="text-green-500" />} href="/tools/compress-image" />
        <MiniToolCard name="Remove BG" icon={<FaEraser className="text-green-500" />} href="/tools/remove-background" />
        <MiniToolCard name="HEIC to JPG" icon={<FaImage className="text-green-500" />} href="/tools/heic-to-jpg" />
        <MiniToolCard name="JPG to WebP" icon={<FaGlobe className="text-green-500" />} href="/tools/jpg-to-webp" />
        <MiniToolCard name="PNG to JPG" icon={<FaImage className="text-green-500" />} href="/tools/png-to-jpg" />
      </MiniGridSection>

      {/* ---------------- SECTION 9: SEO TEXT BLOCK ---------------- */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why SAVEMI.IO is the Solution?</h2>
          <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed">
            <p className="mb-6">
              SAVEMI.IO is your ultimate all-in-one platform providing access to best in class <strong>online PDF tools</strong>, intelligent <strong>best calculators</strong>, and high-performance <strong>image converter</strong> utilities. Designed for speed and privacy, our tools process files securely in the cloud without requiring any software installation.
            </p>
            <p className="mb-6">
              Unlike other services, we offer a truly **free experience** with no mandatory sign-ups. Need to <strong>compress PDF online</strong>? Calculate your home loan with an <strong>EMI calculator</strong>? Or generate a complex report using <strong>AI tools online</strong>? SAVEMI.IO handles it all instantly.
            </p>
            <p>
              Our platform supports wide-ranging formats catering to students, professionals, and businesses alike. From document management to financial planning, we ensure accuracy, speed, and 100% data security.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 11.2: AD SLOT (Before FAQ) ---------------- */}
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="w-[970px] h-[250px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-300 hidden md:flex">
          Wide Billboard Ad (970x250)
        </div>
      </div>

      {/* ---------------- SECTION 10: FAQ SECTION ---------------- */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <SectionTitle title="Frequently Asked Questions" />
          <div className="space-y-4">
            <FAQItem q="What is SAVEMI.IO?" a="SAVEMI.IO is a premier online platform offering 500+ free tools for PDF editing, financial calculations, image conversion, and AI-powered tasks." />
            <FAQItem q="Are the tools free?" a="Yes! All our tools, including premium AI features, are completely free to use with no hidden costs." />
            <FAQItem q="Is my data secure?" a="Security is our top priority. All uploaded files are encrypted via SSL and automatically deleted from our servers within one hour of processing." />
            <FAQItem q="Do I need to install anything?" a="No. SAVEMI.IO is 100% web-based. You can access all tools directly from your browser on any device." />
            <FAQItem q="How do PDF tools work?" a="We use advanced cloud processing to handle your PDFs securely and quickly, ensuring high-quality output every time." />
            <FAQItem q="Which file types are supported?" a="We support all major formats including PDF, DOCX, JPG, PNG, WebP, HEIC, MP4, and more." />
          </div>
        </div>
      </section>

      {/* Schema.org JsonLD (Injected as Script) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SAVEMI.IO",
            "url": "https://savme.io",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://savme.io/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </div>
  );
}

// ---------------- SUB-COMPONENTS ----------------

function QuickActionBtn({ label, href, icon, color }: any) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-6 py-4 rounded-xl border font-semibold transition-all hover:-translate-y-1 shadow-sm hover:shadow-md ${color}`}>
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function ValueBox({ icon, title }: any) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 transition-colors text-center h-full">
      <div className="mb-4 bg-gray-50 p-4 rounded-full">{icon}</div>
      <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
    </div>
  );
}

function ToolCard({ title, desc, icon, color, href }: any) {
  return (
    <Link href={href} className="flex items-start gap-5 p-6 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
      <div className={`p-4 rounded-xl bg-gray-50 text-2xl group-hover:scale-110 transition-transform ${color}`}>{icon}</div>
      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-red-600 transition-colors">{title}</h3>
        <p className="text-sm text-gray-500 leading-snug">{desc}</p>
      </div>
    </Link>
  );
}

function AiFeatureCard({ title, icon }: any) {
  return (
    <Link href="/ai-tools" className="flex flex-col items-center justify-center w-40 h-40 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 hover:scale-105 transition-all shadow-lg hover:shadow-purple-500/20 cursor-pointer">
      <div className="text-4xl text-white mb-3 drop-shadow-md">{icon}</div>
      <span className="text-sm font-semibold px-2 text-center text-white">{title}</span>
    </Link>
  );
}

function MiniGridSection({ title, seeAllLink, children, bg = "bg-white" }: any) {
  return (
    <section className={`py-20 ${bg}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10 pb-4 border-b border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          <Link href={seeAllLink} className="text-red-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            See All Tools <FaChevronRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {children}
        </div>
      </div>
    </section>
  );
}

function MiniToolCard({ name, icon, href }: any) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-xl hover:border-red-200 hover:shadow-lg hover:-translate-y-1 transition-all text-center gap-3 group h-32">
      <div className="text-2xl group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{name}</span>
    </Link>
  );
}

function FAQItem({ q, a }: any) {
  return (
    <details className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <summary className="flex justify-between items-center font-semibold cursor-pointer p-5 text-gray-900 hover:bg-gray-50 transition-colors list-none select-none">
        <span>{q}</span>
        <span className="transition-transform duration-300 group-open:rotate-180">
          <FaChevronRight className="rotate-90" />
        </span>
      </summary>
      <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-50 animate-fade-in">
        <div className="pt-3">{a}</div>
      </div>
    </details>
  );
}

function SectionTitle({ title }: any) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
      <div className="w-16 h-1 bg-red-600 mx-auto mt-4 rounded-full"></div>
    </div>
  );
}
