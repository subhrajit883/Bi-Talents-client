import { motion } from "framer-motion";
import {
    ArrowRight,
    BadgeCheck,
    BriefcaseBusiness,
    Camera,
    CheckCircle2,
    Clapperboard,
    HeartHandshake,
    Play,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    Target,
    Users,
    Zap,
} from "lucide-react";

const AboutPage = () => {
    const categories = [
        {
            title: "Modelling",
            description: "Discover models for campaigns, fashion, commercials and brand shoots.",
            icon: Star,
        },
        {
            title: "Dancing",
            description: "Find trained dancers for music videos, events, campaigns and productions.",
            icon: Sparkles,
        },
        {
            title: "Screen Acting",
            description: "Connect with actors for films, web series, advertisements and digital content.",
            icon: Clapperboard,
        },
        {
            title: "Photography",
            description: "Find creative photographers for portraits, products, campaigns and events.",
            icon: Camera,
        },
    ];

    const values = [
        {
            icon: ShieldCheck,
            title: "Verified Talent",
            description:
                "We help clients discover reliable and authentic talent profiles for their projects.",
        },
        {
            icon: Zap,
            title: "Simple Hiring",
            description:
                "Browse profiles, explore portfolios and connect with the right talent without unnecessary complexity.",
        },
        {
            icon: Users,
            title: "Multiple Categories",
            description:
                "From modelling and acting to dancing and photography, discover talent across creative fields.",
        },
        {
            icon: HeartHandshake,
            title: "Built Around People",
            description:
                "We believe great projects begin when the right people find the right opportunities.",
        },
    ];

    const stats = [
        { value: "500+", label: "Talents" },
        { value: "50+", label: "Happy Clients" },
        { value: "20+", label: "Categories" },
        { value: "100%", label: "Focused on Talent" },
    ];

    return (
        <div className="min-h-screen overflow-hidden bg-white text-slate-900">

            {/* <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
        
                <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#2C78FF]/10 blur-3xl" />
                <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

                <div className="absolute right-10 top-24 hidden lg:block">
                    <div className="grid grid-cols-4 gap-2 opacity-30">
                        {Array.from({ length: 20 }).map((_, index) => (
                            <span
                                key={index}
                                className="h-1.5 w-1.5 rounded-full bg-[#2C78FF]"
                            />
                        ))}
                    </div>
                </div>

                <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pb-24 lg:pt-24">
                    <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">

                     
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-[#2C78FF] shadow-sm">
                                <Sparkles size={16} />
                                More Than A Talent Platform
                            </div>

                            <h1 className="max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                                Connecting
                                <span className="block text-[#2C78FF]">
                                    Talent
                                </span>
                                With Opportunity.
                            </h1>

                            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                                TalentHub is a modern talent hiring platform designed
                                to connect talented individuals with brands, agencies,
                                production houses and creative projects.
                            </p>

                            <div className="mt-9 flex flex-wrap gap-4">
                                <button className="group inline-flex items-center gap-3 rounded-xl bg-[#2C78FF] px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700">
                                    Explore Talents
                                    <ArrowRight
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </button>

                                <button className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:border-[#2C78FF] hover:text-[#2C78FF]">
                                    <Play size={17} />
                                    How It Works
                                </button>
                            </div>

                    
                            <div className="mt-12 grid max-w-xl grid-cols-2 gap-y-7 sm:grid-cols-4">
                                {stats.map((stat) => (
                                    <div key={stat.label}>
                                        <p className="text-2xl font-extrabold text-slate-950">
                                            {stat.value}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                  
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
            
                            <div className="relative mx-auto max-w-lg">
                                <div className="absolute inset-8 rounded-[3rem] bg-[#2C78FF]/20 blur-3xl" />

                                <div className="relative overflow-hidden rounded-[2.5rem] border-8 border-white bg-slate-100 shadow-2xl">
                                    <img
                                        src="https://res.cloudinary.com/hvfoqzjk/image/upload/v1788507198/talent-portal/profile/me7nadwkstvmt5f3kaxl.webp"
                                        alt="Talent"
                                        className="h-[520px] w-full object-cover"
                                    />

                                    <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/50 bg-white/90 p-4 shadow-xl backdrop-blur-md">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-medium text-slate-500">
                                                    TalentHub
                                                </p>
                                                <p className="mt-1 text-lg font-bold text-slate-950">
                                                    Talent Meets Opportunity
                                                </p>
                                            </div>

                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2C78FF] text-white">
                                                <BadgeCheck size={23} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute -left-8 top-20 hidden rounded-2xl border border-blue-100 bg-white p-4 shadow-xl sm:block"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2C78FF]">
                                            <Users size={22} />
                                        </div>

                                        <div>
                                            <p className="text-xl font-extrabold">
                                                500+
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Talents Available
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                
                                <motion.div
                                    animate={{ y: [0, 8, 0] }}
                                    transition={{
                                        duration: 4.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute -right-6 top-1/2 hidden rounded-2xl border border-blue-100 bg-white p-4 shadow-xl sm:block"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2C78FF]">
                                            <BriefcaseBusiness size={21} />
                                        </div>

                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                Find Your Talent
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Start hiring today
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section> */}

        
            <section className="relative bg-white py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid items-center gap-16 lg:grid-cols-2">

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#2C78FF]">
                                Our Story
                            </p>

                            <h2 className="max-w-xl text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl">
                                Built for Creators.
                                <span className="block text-[#2C78FF]">
                                    Designed for Brands.
                                </span>
                            </h2>

                            <p className="mt-6 text-lg leading-8 text-slate-600">
                                Finding the right person for a creative project
                                shouldn't be complicated. TalentHub was created
                                to make that connection easier.
                            </p>

                            <p className="mt-5 leading-7 text-slate-500">
                                Whether you're looking for a model for a campaign,
                                an actor for a production, a dancer for a music
                                video or a photographer for your next project,
                                TalentHub brings talent discovery and hiring
                                together in one simple platform.
                            </p>

                            <div className="mt-8 space-y-4">
                                {[
                                    "Discover talented professionals",
                                    "Explore detailed talent portfolios",
                                    "Connect with the right people",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-[#2C78FF]">
                                            <CheckCircle2 size={17} />
                                        </div>

                                        <span className="font-medium text-slate-700">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Story visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="relative"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="overflow-hidden rounded-3xl">
                                    <img
                                        src="https://res.cloudinary.com/hvfoqzjk/image/upload/v1788507198/talent-portal/portfolio/images/xgeklsnz7jsnmffrt6yg.jpg"
                                        alt="Talent portfolio"
                                        className="h-[380px] w-full object-cover transition duration-500 hover:scale-105"
                                    />
                                </div>

                                <div className="space-y-4 pt-10">
                                    <div className="overflow-hidden rounded-3xl">
                                        <img
                                            src="https://res.cloudinary.com/hvfoqzjk/image/upload/v1788507198/talent-portal/portfolio/images/k0gkkgutx5nllkchrds7.jpg"
                                            alt="Talent portfolio"
                                            className="h-[180px] w-full object-cover transition duration-500 hover:scale-105"
                                        />
                                    </div>

                                    <div className="rounded-3xl bg-[#2C78FF] p-7 text-white">
                                        <Sparkles size={30} />

                                        <p className="mt-5 text-2xl font-bold">
                                            Great talent.
                                            <br />
                                            Great projects.
                                        </p>

                                        <p className="mt-3 text-sm leading-6 text-blue-100">
                                            Creating meaningful connections
                                            between people and opportunities.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 py-24 lg:py-28">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">

                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2C78FF]">
                            What Drives Us
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-5xl">
                            Our Mission & Vision
                        </h2>

                        <p className="mt-5 text-lg leading-8 text-slate-500">
                            We're building a platform where talent can be
                            discovered and opportunities can become real projects.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-6 md:grid-cols-2">

                        {/* Mission */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-xl"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2C78FF]">
                                <Target size={28} />
                            </div>

                            <p className="mt-7 text-sm font-bold uppercase tracking-wider text-[#2C78FF]">
                                Our Mission
                            </p>

                            <h3 className="mt-2 text-2xl font-bold text-slate-950">
                                Make talent discovery simple.
                            </h3>

                            <p className="mt-4 leading-7 text-slate-500">
                                Our mission is to give creative professionals
                                a platform where their skills, experience and
                                portfolios can be discovered by the right clients.
                            </p>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="rounded-3xl bg-[#2C78FF] p-8 text-white shadow-xl shadow-blue-500/20"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                                <Search size={28} />
                            </div>

                            <p className="mt-7 text-sm font-bold uppercase tracking-wider text-blue-100">
                                Our Vision
                            </p>

                            <h3 className="mt-2 text-2xl font-bold">
                                Become the trusted place for creative hiring.
                            </h3>

                            <p className="mt-4 leading-7 text-blue-100">
                                We envision a world where brands and creative
                                professionals can find each other faster,
                                communicate better and create remarkable work
                                together.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                VALUES
            ========================================================= */}
            <section className="bg-white py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">

                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2C78FF]">
                                Why TalentHub
                            </p>

                            <h2 className="mt-3 max-w-2xl text-4xl font-extrabold text-slate-950 sm:text-5xl">
                                Everything starts with the
                                <span className="text-[#2C78FF]">
                                    {" "}right connection.
                                </span>
                            </h2>
                        </div>

                        <p className="max-w-md leading-7 text-slate-500">
                            From discovering talent to making a hiring decision,
                            we're creating a smoother experience for everyone.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((value, index) => {
                            const Icon = value.icon;

                            return (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.08,
                                    }}
                                    whileHover={{ y: -7 }}
                                    className="group rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-xl"
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2C78FF] transition-all duration-300 group-hover:bg-[#2C78FF] group-hover:text-white">
                                        <Icon size={25} />
                                    </div>

                                    <h3 className="mt-6 text-xl font-bold text-slate-950">
                                        {value.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-slate-500">
                                        {value.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* =========================================================
                CATEGORIES
            ========================================================= */}
            <section className="relative overflow-hidden bg-slate-950 py-24 text-white lg:py-28">
                <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#2C78FF]/30 blur-3xl" />
                <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

                    <div className="max-w-2xl">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                            Explore Possibilities
                        </p>

                        <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">
                            Talent across
                            <span className="text-[#2C78FF]">
                                {" "}creative categories.
                            </span>
                        </h2>

                        <p className="mt-5 leading-7 text-slate-400">
                            Whatever your project needs, discover talented
                            professionals with the skills and experience to
                            bring your ideas to life.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {categories.map((category) => {
                            const Icon = category.icon;

                            return (
                                <motion.div
                                    key={category.title}
                                    whileHover={{ y: -6 }}
                                    className="group rounded-3xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-sm transition-all duration-300 hover:border-[#2C78FF]/60 hover:bg-[#2C78FF]/10"
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-400 transition-all group-hover:bg-[#2C78FF] group-hover:text-white">
                                        <Icon size={25} />
                                    </div>

                                    <h3 className="mt-7 text-xl font-bold">
                                        {category.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-slate-400">
                                        {category.description}
                                    </p>

                                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-400">
                                        Explore
                                        <ArrowRight
                                            size={16}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* =========================================================
                CTA
            ========================================================= */}
            <section className="bg-white px-6 py-20 lg:px-8 lg:py-28">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#2C78FF] to-blue-600 px-8 py-14 text-center shadow-2xl shadow-blue-500/20 sm:px-12 lg:py-20"
                >
                    {/* Decorative circles */}
                    <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full border-[40px] border-white/10" />
                    <div className="absolute -bottom-28 -right-10 h-72 w-72 rounded-full border-[50px] border-white/10" />

                    <div className="relative mx-auto max-w-3xl">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
                            <BriefcaseBusiness size={27} />
                        </div>

                        <h2 className="mt-7 text-4xl font-extrabold text-white sm:text-5xl">
                            Your next great project
                            <br />
                            starts with the right talent.
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
                            Explore talented professionals and find the people
                            who can bring your next idea to life.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <button className="group inline-flex items-center gap-3 rounded-xl bg-white px-7 py-3.5 font-bold text-[#2C78FF] shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-50">
                                Browse Talents
                                <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </button>

                            <button className="inline-flex items-center gap-3 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur-sm transition hover:bg-white/20">
                                Become a Client
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default AboutPage;