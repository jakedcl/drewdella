"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Masonry } from "@mui/lab";
import { CircularProgress, Box } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import { urlFor, fetchSanityData } from "../../lib/sanity";
import { formatElapsed, SerpFooter } from "../../components/SearchResults/SearchResults.jsx";
import SerpMessage from "../../components/SerpMessage/SerpMessage.jsx";
import "./ImagesPage.css";

const SOURCE_NAME = "drewdella.com";

function imageKey(image) {
  return image?.id || image?.asset?._id || "";
}

function shuffle(items) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function hiResImageUrl(asset) {
  if (!asset) return "";
  const w = asset?.metadata?.dimensions?.width;
  const h = asset?.metadata?.dimensions?.height;
  const cap = 2560;
  const b = urlFor(asset).auto("format");
  if (w && h) {
    const longest = Math.min(Math.max(w, h), cap);
    return w >= h ? b.width(longest).url() : b.height(longest).url();
  }
  return b.width(1920).url();
}

function imageLabel(image) {
  return image?.caption || image?.alt || "Photo";
}

function ImagesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState("0.12");
  const [activeImage, setActiveImage] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [heroSrc, setHeroSrc] = useState("");
  const [heroReady, setHeroReady] = useState(false);
  const [actionNote, setActionNote] = useState("");
  const closeBtnRef = useRef(null);
  const panelRef = useRef(null);
  const heroLoadId = useRef(0);
  const openedFromQuery = useRef(false);

  const syncImgParam = useCallback(
    (image) => {
      const key = imageKey(image);
      if (!key) {
        router.replace(pathname);
        return;
      }
      router.replace(`${pathname}?img=${encodeURIComponent(key)}`);
    },
    [pathname, router]
  );

  const openImage = useCallback(
    (image) => {
      setHeroReady(false);
      setActiveImage(image);
      setSuggested(shuffle(images.filter((img) => imageKey(img) !== imageKey(image))));
      syncImgParam(image);
    },
    [images, syncImgParam]
  );

  const closePanel = useCallback(() => {
    heroLoadId.current += 1;
    setActiveImage(null);
    setSuggested([]);
    setHeroSrc("");
    setHeroReady(false);
    setActionNote("");
    router.replace(pathname);
  }, [pathname, router]);

  const activeUrl = useMemo(
    () => (activeImage ? hiResImageUrl(activeImage.asset) : ""),
    [activeImage]
  );

  const thumbUrl = useMemo(
    () =>
      activeImage
        ? urlFor(activeImage.asset).width(800).auto("format").url()
        : "",
    [activeImage]
  );

  const panelTitle = useMemo(
    () => (activeImage ? imageLabel(activeImage) : ""),
    [activeImage]
  );

  /* Show cached thumb first, then upgrade to hi-res; hold suggested until hero paints */
  useEffect(() => {
    if (!activeImage || !thumbUrl || !activeUrl) return undefined;

    const loadId = ++heroLoadId.current;
    setHeroReady(false);
    setHeroSrc(thumbUrl);
    panelRef.current?.scrollTo({ top: 0 });

    const hiRes = new Image();
    hiRes.decoding = "async";
    hiRes.onload = () => {
      if (loadId !== heroLoadId.current) return;
      setHeroSrc(activeUrl);
    };
    hiRes.onerror = () => {
      /* keep thumb if hi-res fails */
    };
    hiRes.src = activeUrl;

    return () => {
      hiRes.onload = null;
      hiRes.onerror = null;
    };
  }, [activeImage, thumbUrl, activeUrl]);

  const handleVisit = useCallback(() => {
    if (!activeUrl) return;
    window.open(activeUrl, "_blank", "noopener,noreferrer");
  }, [activeUrl]);

  const handleShare = useCallback(async () => {
    if (!activeUrl) return;
    const pageUrl = `${window.location.origin}/images`;
    const payload = {
      title: panelTitle,
      text: panelTitle,
      url: pageUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(pageUrl);
        setActionNote("Link copied");
        window.setTimeout(() => setActionNote(""), 2000);
      }
    } catch {
      /* user cancelled share */
    }
  }, [activeUrl, panelTitle]);

  const handleSave = useCallback(() => {
    if (!activeUrl) return;
    window.open(activeUrl, "_blank", "noopener,noreferrer");
    setActionNote("Opened full image — save from your browser");
    window.setTimeout(() => setActionNote(""), 2800);
  }, [activeUrl]);

  useEffect(() => {
    if (!activeImage) return undefined;
    closeBtnRef.current?.focus();
  }, [activeImage]);

  useEffect(() => {
    const fetchImages = async () => {
      const started = performance.now();
      try {
        setLoading(true);
        setError(null);

        const query = `*[_type == "imageGallery"][0] {
          title,
          galleryImages[] {
            asset->{
              _id,
              url,
              metadata {
                dimensions
              }
            },
            alt,
            caption,
            "id": _key
          }
        }`;

        const data = await fetchSanityData(query);

        if (!data || !data.galleryImages) {
          setImages([]);
        } else {
          const validImages = data.galleryImages.filter(
            (img) => img && img.asset
          );
          setImages(validImages);
        }
        setElapsed(formatElapsed(performance.now() - started));
      } catch (err) {
        console.error("Error fetching images:", err);
        setError(
          err.message || "Failed to load images. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  /* Open panel when arriving from All (or a shared ?img= link) */
  useEffect(() => {
    if (loading || !images.length || openedFromQuery.current) return;
    const want = searchParams.get("img");
    if (!want) return;
    const match = images.find(
      (img) => imageKey(img) === want || img.asset?._id === want
    );
    if (match) {
      openedFromQuery.current = true;
      setHeroReady(false);
      setActiveImage(match);
      setSuggested(
        shuffle(images.filter((img) => imageKey(img) !== imageKey(match)))
      );
    }
  }, [loading, images, searchParams]);

  useEffect(() => {
    if (!activeImage) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closePanel();
    };

    window.addEventListener("keydown", onKeyDown);

    const isMobile = window.matchMedia("(max-width: 899px)").matches;
    const prevOverflow = document.body.style.overflow;
    if (isMobile) document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeImage, closePanel]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <SerpMessage
          title="Images are taking a break."
          detail="Couldn’t load photos right now. Try again in a bit."
          links={[
            { to: "/", label: "All results" },
            { to: "/home", label: "Home" },
          ]}
        />
      </Box>
    );
  }

  if (!images.length) {
    return (
      <Box p={2}>
        <SerpMessage
          title="No images to show yet."
          detail="Photos will show up here when they’re ready."
          links={[
            { to: "/", label: "All results" },
            { to: "/videos", label: "Videos" },
          ]}
        />
      </Box>
    );
  }

  return (
    <>
      <div
        className={`images-page${activeImage ? " images-page--panel-open" : ""}`}
      >
        <p className="images-stats">
          About {images.length.toLocaleString("en-US")} result
          {images.length === 1 ? "" : "s"} ({elapsed} seconds)
        </p>
        <Masonry
          columns={{ xs: 3, sm: 4, md: 5, lg: 6, xl: 7 }}
          spacing={0.75}
          sx={{ ml: 0, mr: 0, width: "100%" }}
        >
          {images.map((image) => (
            <div key={imageKey(image)} className="images-result">
              {image.asset && (
                <button
                  type="button"
                  className={`images-thumb${
                    imageKey(activeImage) === imageKey(image)
                      ? " images-thumb--active"
                      : ""
                  }`}
                  onClick={() => openImage(image)}
                  aria-label={
                    image.alt
                      ? `Open image: ${image.alt}`
                      : "Open image detail"
                  }
                >
                  <img
                    src={urlFor(image.asset).width(360).auto("format").url()}
                    alt={image.alt || "Gallery image"}
                    loading="lazy"
                    draggable={false}
                    onError={(e) => {
                      console.error("Image failed to load:", image.asset._id);
                      e.target.style.display = "none";
                    }}
                  />
                  {(image.caption || image.alt) && (
                    <span className="images-result-title">
                      {image.caption || image.alt}
                    </span>
                  )}
                </button>
              )}
            </div>
          ))}
        </Masonry>
        <div className="images-serp-footer">
          <SerpFooter />
        </div>
      </div>

      {activeImage && (
        <>
          <button
            type="button"
            className="images-panel-backdrop"
            aria-label="Close image detail"
            onClick={closePanel}
          />
          <aside
            ref={panelRef}
            className="images-panel"
            role="dialog"
            aria-modal="true"
            aria-label={panelTitle}
          >
            <div className="images-panel-bar">
              <div className="images-panel-source">
                <span>{SOURCE_NAME}</span>
              </div>
              <button
                type="button"
                className="images-panel-close"
                ref={closeBtnRef}
                onClick={closePanel}
                aria-label="Close"
              >
                <CloseRoundedIcon fontSize="small" />
              </button>
            </div>

            <div className="images-panel-hero">
              <img
                key={imageKey(activeImage)}
                src={heroSrc || thumbUrl}
                alt={activeImage.alt || "Gallery image"}
                draggable={false}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onLoad={() => setHeroReady(true)}
                onError={() => setHeroReady(true)}
              />
            </div>

            <div className="images-panel-meta">
              <div className="images-panel-meta-row">
                <div className="images-panel-copy">
                  <h2 className="images-panel-title">{panelTitle}</h2>
                  <p className="images-panel-subtitle">
                    {activeImage.alt && activeImage.caption
                      ? activeImage.alt
                      : SOURCE_NAME}
                  </p>
                </div>
                <button
                  type="button"
                  className="images-btn images-btn--visit images-btn--visit-inline"
                  onClick={handleVisit}
                >
                  Visit
                  <OpenInNewRoundedIcon sx={{ fontSize: 16 }} />
                </button>
              </div>

              <div className="images-panel-actions">
                <button
                  type="button"
                  className="images-btn images-btn--visit images-btn--visit-row"
                  onClick={handleVisit}
                >
                  Visit
                  <OpenInNewRoundedIcon sx={{ fontSize: 16 }} />
                </button>
                <button
                  type="button"
                  className="images-btn images-btn--secondary"
                  onClick={handleShare}
                >
                  <IosShareRoundedIcon sx={{ fontSize: 18 }} />
                  Share
                </button>
                <button
                  type="button"
                  className="images-btn images-btn--secondary"
                  onClick={handleSave}
                >
                  <BookmarkBorderRoundedIcon sx={{ fontSize: 18 }} />
                  Save
                </button>
              </div>
              {actionNote ? (
                <p className="images-panel-note" role="status">
                  {actionNote}
                </p>
              ) : null}
            </div>

            {suggested.length > 0 && heroReady && (
              <div className="images-panel-suggested">
                <Masonry columns={2} spacing={1.5}>
                  {suggested.map((image) => (
                    <div key={imageKey(image)} className="images-suggested-card">
                      <button
                        type="button"
                        className="images-suggested-thumb"
                        onClick={() => openImage(image)}
                        aria-label={
                          image.alt
                            ? `Open image: ${image.alt}`
                            : "Open image detail"
                        }
                      >
                        <img
                          src={urlFor(image.asset)
                            .width(500)
                            .auto("format")
                            .url()}
                          alt={image.alt || "Gallery image"}
                          loading="lazy"
                          fetchPriority="low"
                          draggable={false}
                        />
                      </button>
                      <p className="images-suggested-title">
                        {imageLabel(image)}
                      </p>
                    </div>
                  ))}
                </Masonry>
              </div>
            )}
          </aside>
        </>
      )}
    </>
  );
}

export default ImagesPage;
