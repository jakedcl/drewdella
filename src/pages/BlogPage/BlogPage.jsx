import React, { useState, useEffect, useRef } from "react";
import { client, urlFor } from "../../lib/sanity";
import "./BlogPage.css";

/** CSS max widths — must stay in sync with BlogPage.css */
const BLOG_IMAGE_DISPLAY_PX = {
    small: 300,
    medium: 500,
    large: 700,
    full: 1000, // .blog-page max-width
};

/** `sizes` hints for responsive srcset (layout width, not pixel density) */
const BLOG_IMAGE_SIZES = {
    small: "(max-width: 300px) 100vw, 300px",
    medium: "(max-width: 500px) 100vw, 500px",
    large: "(max-width: 700px) 100vw, 700px",
    full: "(max-width: 1000px) 100vw, 1000px",
};

const MAX_SRC_WIDTH = 2400;

/**
 * Blog images were requested at 1× display width, so they looked soft on retina.
 * srcSet + sizes lets 1× screens load lighter URLs while 2× gets enough pixels.
 */
function blogImageResponsiveSources(asset, sizeKey) {
    const displayMax = BLOG_IMAGE_DISPLAY_PX[sizeKey] || BLOG_IMAGE_DISPLAY_PX.medium;
    const w1 = displayMax;
    const w2 = Math.min(displayMax * 2, MAX_SRC_WIDTH);
    const base = () => urlFor(asset).auto("format");
    const url1 = base().width(w1).url();
    const url2 = base().width(w2).url();
    const srcSet =
        w2 > w1 ? `${url1} ${w1}w, ${url2} ${w2}w` : `${url1} ${w1}w`;
    return {
        src: url2,
        srcSet,
        sizes: BLOG_IMAGE_SIZES[sizeKey] || BLOG_IMAGE_SIZES.medium,
    };
}

function BlogPost({ post, formatDate, renderContent }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = useRef(null);
    const [needsReadMore, setNeedsReadMore] = useState(false);

    useEffect(() => {
        // Check if content exceeds 12 lines after render
        const checkHeight = () => {
            if (contentRef.current) {
                const lineHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight) || 22.12; // fallback to 1.58em * 14px
                const maxHeight = lineHeight * 12;
                const actualHeight = contentRef.current.scrollHeight;
                setNeedsReadMore(actualHeight > maxHeight);
            }
        };

        // Check immediately and after a short delay to ensure content is rendered
        checkHeight();
        const timeout = setTimeout(checkHeight, 100);
        
        return () => clearTimeout(timeout);
    }, [post._id]); // Use post._id instead of post.content to avoid unnecessary re-renders

    return (
        <article className="blog-post">
            <div className="blog-post-content">
                <h2 className="blog-post-title">{post.title}</h2>
                <time className="blog-post-date" dateTime={post.date}>
                    {formatDate(post.date)}
                </time>
                <div 
                    ref={contentRef}
                    className={`blog-post-body ${isExpanded ? 'expanded' : 'collapsed'}`}
                >
                    {renderContent(post.content)}
                </div>
                {needsReadMore && (
                    <button 
                        className="blog-read-more-btn"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Read less' : 'Read more'}
                    </button>
                )}
            </div>
        </article>
    );
}

function BlogPage() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const query = `*[_type == "blogPost"] | order(date desc) {
          _id,
          title,
          date,
          content[]{
            ...,
            _type == "image" => {
              ...,
              asset->
            },
            _type == "block" => {
              ...,
              markDefs[]{
                ...,
                _type == "link" => {
                  ...
                }
              }
            }
          },
          slug
        }`;

                const data = await client.fetch(query);
                setBlogPosts(data);
            } catch (err) {
                console.error("Error fetching blog posts:", err);
                setError("Failed to load blog posts");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderContent = (content) => {
        if (!content) return null;

        return content.map((block, index) => {
            if (block._type === 'block') {
                const style = block.style || 'normal';

                // Handle text with marks (bold, italic, links, etc.)
                const renderText = (children, markDefs = []) => {
                    if (!children) return '';
                    return children.map((child, childIndex) => {
                        let text = child.text || '';

                        // Handle marks (decorators and annotations)
                        if (child.marks && child.marks.length > 0) {
                            // Process marks in reverse order to properly nest elements
                            child.marks.slice().reverse().forEach(mark => {
                                if (mark === 'strong') {
                                    text = <strong key={`${childIndex}-strong`}>{text}</strong>;
                                } else if (mark === 'em') {
                                    text = <em key={`${childIndex}-em`}>{text}</em>;
                                } else if (mark === 'code') {
                                    text = <code key={`${childIndex}-code`} className="blog-code">{text}</code>;
                                } else {
                                    // Handle annotations (like links) - mark is a key
                                    const markDef = markDefs.find(def => def._key === mark);
                                    if (markDef && markDef._type === 'link') {
                                        text = (
                                            <a
                                                key={`${childIndex}-link`}
                                                href={markDef.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="blog-link"
                                            >
                                                {text}
                                            </a>
                                        );
                                    }
                                }
                            });
                        }

                        return <React.Fragment key={childIndex}>{text}</React.Fragment>;
                    });
                };

                const textContent = block.children ? renderText(block.children, block.markDefs || []) : '';

                // Handle lists
                if (block.listItem) {
                    const ListTag = block.listItem === 'bullet' ? 'ul' : 'ol';
                    return (
                        <ListTag key={index} className="blog-list">
                            <li className="blog-list-item">{textContent}</li>
                        </ListTag>
                    );
                }

                switch (style) {
                    case 'h1':
                        return <h1 key={index} className="blog-h1">{textContent}</h1>;
                    case 'h2':
                        return <h2 key={index} className="blog-h2">{textContent}</h2>;
                    case 'h3':
                        return <h3 key={index} className="blog-h3">{textContent}</h3>;
                    case 'blockquote':
                        return <blockquote key={index} className="blog-blockquote">{textContent}</blockquote>;
                    default:
                        return <p key={index} className="blog-paragraph">{textContent}</p>;
                }
            }

            if (block._type === 'image' && block.asset) {
                const size = block.size || 'medium';
                const { src, srcSet, sizes } = blogImageResponsiveSources(
                    block.asset,
                    size
                );

                const imageClass = `blog-image blog-image-${size}`;

                return (
                    <div key={index} className={`blog-image-container blog-image-container-${size}`}>
                        <img
                            src={src}
                            srcSet={srcSet}
                            sizes={sizes}
                            alt={block.alt || ''}
                            className={imageClass}
                            loading="lazy"
                            onError={(e) => {
                                console.error('Image failed to load:', block.asset._id);
                                e.target.style.display = 'none';
                            }}
                        />
                        {block.caption && (
                            <p className="blog-image-caption">{block.caption}</p>
                        )}
                    </div>
                );
            }

            return null;
        });
    };

    if (loading) {
        return (
            <div className="blog-page">
                <div className="blog-header">
                    <h1>Blog</h1>
                </div>
                <div className="blog-loading">
                    <p>Loading posts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="blog-page">
                <div className="blog-header">
                    <h1>Blog</h1>
                </div>
                <div className="blog-error">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-page">
            <div className="blog-content">
                {blogPosts.length === 0 ? (
                    <div className="blog-empty">
                        <p>No blog posts yet. Check back soon!</p>
                    </div>
                ) : (
                    blogPosts.map((post) => (
                        <BlogPost 
                            key={post._id} 
                            post={post}
                            formatDate={formatDate}
                            renderContent={renderContent}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default BlogPage;
