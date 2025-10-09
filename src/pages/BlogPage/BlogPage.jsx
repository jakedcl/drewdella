import React, { useState, useEffect } from "react";
import { client } from "../../lib/sanity";
import "./BlogPage.css";

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
          content,
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
                const text = block.children?.map(child => child.text).join('') || '';

                switch (style) {
                    case 'h1':
                        return <h1 key={index} className="blog-h1">{text}</h1>;
                    case 'h2':
                        return <h2 key={index} className="blog-h2">{text}</h2>;
                    case 'h3':
                        return <h3 key={index} className="blog-h3">{text}</h3>;
                    case 'blockquote':
                        return <blockquote key={index} className="blog-blockquote">{text}</blockquote>;
                    default:
                        return <p key={index} className="blog-paragraph">{text}</p>;
                }
            }

            if (block._type === 'image') {
                return (
                    <div key={index} className="blog-image-container">
                        <img
                            src={block.asset?.url}
                            alt={block.alt || ''}
                            className="blog-image"
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
            <div className="blog-header">
                <h1>Blog</h1>
            </div>

            <div className="blog-content">
                {blogPosts.length === 0 ? (
                    <div className="blog-empty">
                        <p>No blog posts yet. Check back soon!</p>
                    </div>
                ) : (
                    blogPosts.map((post) => (
                        <article key={post._id} className="blog-post">
                            <header className="blog-post-header">
                                <h2 className="blog-post-title">{post.title}</h2>
                                <time className="blog-post-date" dateTime={post.date}>
                                    {formatDate(post.date)}
                                </time>
                            </header>
                            <div className="blog-post-content">
                                {renderContent(post.content)}
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}

export default BlogPage;
