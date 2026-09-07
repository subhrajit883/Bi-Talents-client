import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiChevronLeft,
  FiShare2,
  FiUser,
  FiMapPin,
  FiBriefcase,
  FiPlay,
  FiGrid,
  FiArrowUpRight,
  FiCheck,
  FiImage,
  FiVideo,
} from "react-icons/fi";
import { HiCheckBadge } from "react-icons/hi2";
import { talentUrl } from "../config/config";

const TalentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mainMedia, setMainMedia] = useState(null);

  useEffect(() => {
    const fetchTalent = async () => {
      try {
        const res = await axios.get(`${talentUrl.getTalentById}${id}`);

        console.log("details", res.data);

        if (res.data.success) {
          setTalent(res.data.talent);

          setMainMedia({
            type: "image",
            url: res.data.talent.profileImage?.url,
          });
        } else {
          setError("Talent not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load talent details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTalent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-4 border-blue-100" />
            <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-t-[#2C78FF] animate-spin" />
          </div>

          <p className="text-sm font-medium text-slate-500">
            Loading talent profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !talent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-10 text-center shadow-xl shadow-slate-200/60 border border-slate-100">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-blue-50 flex items-center justify-center">
            <FiUser className="text-[#2C78FF]" size={28} />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Talent not found
          </h2>

          <p className="text-sm text-slate-500 mb-7">
            {error || "The talent profile you're looking for doesn't exist."}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2C78FF] text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <FiChevronLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const categoryName = talent.categories?.[0]?.name || "Talent";

  const thumbnails = [
    {
      type: "image",
      url: talent.profileImage?.url,
      id: "profile",
    },
    ...(talent.portfolioImages || []).map((img) => ({
      type: "image",
      url: img.url,
      id: img._id,
    })),
    ...(talent.portfolioVideos || []).map((vid) => ({
      type: "video",
      url: vid.url,
      id: vid._id,
    })),
  ].filter((media) => media.url);

  const selectMedia = (media) => {
    setMainMedia(media);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* =========================================================
          TOP NAV
      ========================================================= */}
      <div className="   backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2C78FF] transition-colors"
          >
            <span className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
              <FiChevronLeft size={19} />
            </span>

            <span className="hidden sm:block">Back to Talents</span>
          </button>

          <div className="flex items-center gap-2">
            {/* <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Talent</span>
              <span>/</span>
              <span className="text-slate-700">{talent.name}</span>
            </div> */}

            {/* Share button can be enabled later */}
            {/* 
            <button
              className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-blue-50
              text-slate-500 hover:text-[#2C78FF] flex items-center justify-center"
            >
              <FiShare2 size={17} />
            </button>
            */}
          </div>
        </div>
      </div>

      {/* =========================================================
          HERO / MAIN PROFILE
      ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] gap-8 xl:gap-14 items-start">
          {/* =====================================================
              LEFT - MEDIA
          ===================================================== */}
          <section>
            <div className="relative">
              {/* Decorative background */}
              <div className="absolute -inset-3 bg-gradient-to-br from-blue-100/70 via-transparent to-blue-50/50 rounded-[2rem] blur-xl" />

              <div className="relative bg-white p-2 rounded-[2rem] border border-slate-200/80 shadow-xl shadow-slate-200/40">
                {/* Main media */}
                <div className="relative aspect-[4/5] sm:aspect-[4/4.5] lg:aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-slate-100">
                  {mainMedia?.type === "video" ? (
                    <video
                      src={mainMedia.url}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={mainMedia?.url}
                      alt={talent.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          talent.name
                        )}&background=2C78FF&color=fff&size=700`;
                      }}
                    />
                  )}

                  {/* Gradient overlay */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/35 to-transparent" />

                  {/* Media count */}
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/45 backdrop-blur-md text-white text-xs font-semibold">
                      <FiImage size={14} />
                      <span>{thumbnails.length} Media</span>
                    </div>
                  </div>

                  {/* Verified badge */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md shadow-lg">
                      <HiCheckBadge
                        size={18}
                        className="text-[#2C78FF]"
                      />
                      <span className="text-xs font-bold text-slate-800">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ===================================================
                THUMBNAILS
            =================================================== */}
            {thumbnails.length > 1 && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                    Profile Gallery
                  </p>

                  <p className="text-xs text-slate-400">
                    {thumbnails.length} items
                  </p>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {thumbnails.map((media) => {
                    const isActive = mainMedia?.url === media.url;

                    return (
                      <button
                        key={media.id}
                        onClick={() => setMainMedia(media)}
                        className={`
                          relative flex-shrink-0
                          w-[72px] h-[88px] sm:w-[80px] sm:h-[96px]
                          rounded-2xl overflow-hidden
                          bg-slate-100
                          transition-all duration-300
                          ${
                            isActive
                              ? "ring-2 ring-[#2C78FF] ring-offset-2 opacity-100 scale-[1.02]"
                              : "opacity-60 hover:opacity-100"
                          }
                        `}
                      >
                        {media.type === "video" ? (
                          <>
                            <video
                              src={media.url}
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <span className="w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                                <FiPlay
                                  size={13}
                                  className="text-[#2C78FF] ml-0.5"
                                  fill="currentColor"
                                />
                              </span>
                            </div>
                          </>
                        ) : (
                          <img
                            src={media.url}
                            alt="Talent thumbnail"
                            className="w-full h-full object-cover"
                          />
                        )}

                        {isActive && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#2C78FF] flex items-center justify-center">
                            <FiCheck size={12} className="text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* =====================================================
              RIGHT - PROFILE INFORMATION
          ===================================================== */}
          <section className="lg:pt-4">
            {/* Category */}
            {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2C78FF] mb-5">
              <FiGrid size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {categoryName}
              </span>
            </div> */}

            {/* Name */}
            <div className="mb-6">
              <h1 className="text-4xl sm:text-2xl xl:text-[3.5rem] font-black font-semibold tracking-tight text-slate-950 leading-[1.05]">
                {talent.name}
              </h1>

              <div className="flex items-center gap-2 mt-4">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                  <HiCheckBadge
                    size={17}
                    className="text-[#2C78FF]"
                  />
                </div>

                <span className="text-sm font-semibold text-slate-500">
                  Verified Talent
                </span>
              </div>
            </div>

            {/* Short divider */}
            <div className="w-16 h-1 rounded-full bg-[#2C78FF] mb-8" />

            {/* =================================================
                INFO CARDS
            ================================================= */}
            <div className="space-y-3">
              {/* Age */}
              <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/40 transition-all duration-300">
                <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-blue-50 text-[#2C78FF] flex items-center justify-center group-hover:bg-[#2C78FF] group-hover:text-white transition-colors">
                  <FiUser size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Age
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {talent.age} Years
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/40 transition-all duration-300">
                <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-blue-50 text-[#2C78FF] flex items-center justify-center group-hover:bg-[#2C78FF] group-hover:text-white transition-colors">
                  <FiMapPin size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900 leading-relaxed">
                    {talent.address}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/40 transition-all duration-300">
                <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-blue-50 text-[#2C78FF] flex items-center justify-center group-hover:bg-[#2C78FF] group-hover:text-white transition-colors">
                  <FiGrid size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Specialization
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {categoryName}
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                WORKS
            ================================================= */}
            {talent.works && talent.works.length > 0 && (
              <div className="mt-7 p-5 rounded-2xl bg-white border border-slate-200/80">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2C78FF] flex items-center justify-center">
                    <FiBriefcase size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Experience
                    </p>

                    {/* <h3 className="text-sm font-bold text-slate-900">
                      Selected Works
                    </h3> */}
                  </div>
                </div>

                <div className="space-y-2">
                  {talent.works.map((work, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 transition-colors"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2C78FF] flex-shrink-0" />

                      <p className="text-sm font-medium leading-relaxed text-slate-700">
                        {work}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =================================================
                HIRE BUTTON
            ================================================= */}
            <button
              className="
                group relative overflow-hidden
                w-full mt-7
                flex items-center justify-center gap-3
                bg-[#2C78FF]
                hover:bg-blue-700
                text-white
                font-bold
                py-4
                rounded-2xl
                transition-all duration-300
                shadow-xl shadow-blue-200
                hover:shadow-2xl hover:shadow-blue-300
                hover:-translate-y-0.5
              "
            >
              <span className="relative z-10">Hire {talent.name}</span>

              <span className="relative z-10 w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                <FiArrowUpRight size={18} />
              </span>

              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>

            <p className="text-center text-xs text-slate-400 mt-3">
              Connect with this talent for your next project
            </p>
          </section>
        </div>

        {/* =========================================================
            PORTFOLIO
        ========================================================= */}
        {(talent.portfolioImages?.length > 0 ||
          talent.portfolioVideos?.length > 0) && (
          <section className="mt-20 lg:mt-28">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 text-[#2C78FF] mb-3">
                  <span className="w-8 h-[2px] bg-[#2C78FF]" />

                  <span className="text-xs font-bold uppercase tracking-[0.18em]">
                    Showcase
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                  Portfolio
                </h2>

                <p className="text-sm text-slate-500 mt-2 max-w-lg">
                  Explore selected images and videos from {talent.name}'s
                  portfolio.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span>{talent.portfolioImages?.length || 0} Images</span>
                <span className="text-slate-300">•</span>
                <span>{talent.portfolioVideos?.length || 0} Videos</span>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent mb-10" />

            {/* =====================================================
                IMAGES
            ===================================================== */}
            {talent.portfolioImages?.length > 0 && (
              <div className="mb-14">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2C78FF] flex items-center justify-center">
                    <FiImage size={17} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    Images
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {talent.portfolioImages.map((img, index) => (
                    <button
                      key={img._id}
                      onClick={() =>
                        selectMedia({
                          type: "image",
                          url: img.url,
                          id: img._id,
                        })
                      }
                      className={`
                        group relative
                        aspect-[4/5]
                        overflow-hidden
                        rounded-2xl
                        bg-slate-100
                        text-left
                        ${
                          index === 0
                            ? "md:col-span-2 md:row-span-2 aspect-auto md:aspect-[4/5]"
                            : ""
                        }
                      `}
                    >
                      <img
                        src={img.url}
                        alt={`${talent.name} portfolio`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <span className="text-xs font-semibold text-white">
                          View Image
                        </span>

                        <span className="w-8 h-8 rounded-lg bg-white/90 text-slate-800 flex items-center justify-center">
                          <FiArrowUpRight size={15} />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* =====================================================
                VIDEOS
            ===================================================== */}
            {talent.portfolioVideos?.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2C78FF] flex items-center justify-center">
                    <FiVideo size={17} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    Videos
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {talent.portfolioVideos.map((vid) => (
                    <button
                      key={vid._id}
                      onClick={() =>
                        selectMedia({
                          type: "video",
                          url: vid.url,
                          id: vid._id,
                        })
                      }
                      className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-950 text-left"
                    >
                      <video
                        src={vid.url}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/20" />

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                          <FiPlay
                            size={22}
                            className="text-[#2C78FF] ml-1"
                            fill="currentColor"
                          />
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Watch Video
                        </span>

                        <span className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md text-white flex items-center justify-center">
                          <FiArrowUpRight size={15} />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* =========================================================
            BOTTOM CTA
        ========================================================= */}
        <section className="mt-20 lg:mt-28">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 sm:px-10 lg:px-14">
            {/* Decorative circles */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#2C78FF]/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300 mb-3">
                  Ready to collaborate?
                </p>

                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Looking for someone like {talent.name}?
                </h2>

                <p className="text-sm text-slate-400 mt-2 max-w-xl">
                  Get in touch and bring the right talent to your next
                  project.
                </p>
              </div>

              <button className="flex-shrink-0 group inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-[#2C78FF] hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-900/30">
                Hire Now

                <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <FiArrowUpRight size={16} />
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TalentDetails;