import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import api from '../api/client.js';
import ArticleCard from '../components/ArticleCard.jsx';
import Reveal from '../components/Reveal.jsx';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/articles/${slug}`)
      .then((res) => {
        setArticle(res.data);
        return api.get('/articles');
      })
      .then((res) => setRelated(res.data.filter((a) => a.slug !== slug).slice(0, 3)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container-x pt-40 pb-20">
        <div className="skeleton h-6 w-40" />
        <div className="skeleton mt-6 h-10 w-3/4" />
        <div className="skeleton mt-6 h-96 w-full" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container-x pt-40 pb-20 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Article not found</h1>
        <Link to="/articles" className="btn-primary mt-6">
          Back to articles
        </Link>
      </div>
    );
  }

  return (
    <>
      <article className="pt-32 sm:pt-40">
        <div className="container-x max-w-3xl">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-brand-600"
          >
            <ArrowLeft size={16} /> All articles
          </Link>
          <span className="chip mt-6">
            <Tag size={13} /> {article.category}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
            {article.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-ink-500">
            <span className="flex items-center gap-1.5">
              <User size={15} /> {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={15} /> {formatDate(article.createdAt)}
            </span>
          </div>
        </div>

        {article.image && (
          <div className="container-x mt-8 max-w-4xl">
            <Reveal>
              <img
                src={article.image}
                alt={article.title}
                className="h-[26rem] w-full rounded-3xl object-cover shadow-soft"
              />
            </Reveal>
          </div>
        )}

        <div className="container-x mt-10 max-w-3xl">
          <p className="border-l-4 border-brand-400 bg-brand-50/60 px-5 py-4 text-lg font-medium italic text-ink-700">
            {article.excerpt}
          </p>
          <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-ink-600">
            {article.content.split('\n').filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Link to detailed report/article */}
          <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl bg-brand-50/70 p-5 ring-1 ring-brand-100 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-700">Detailed version</p>
              <p className="mt-1 text-sm text-ink-600">Access the complete full report/article from here.</p>
            </div>
            <div>
              {article.driveLink ? (
                <a
                  href={article.driveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  Open full report
                </a>
              ) : (
                <Link to={`/articles/${article.slug}`} className="btn-primary">
                  Open full report
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-photo-soft section relative mt-12">
          <div className="container-x">
            <h2 className="text-2xl font-extrabold text-ink-900">Related articles</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ArticleDetail;

