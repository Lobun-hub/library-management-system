import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="not-found-page">
      <p className="eyebrow"><span /> LOST IN THE STACKS</p>
      <h1>This page isn’t<br /><em>on the shelf.</em></h1>
      <Link className="button button-dark" to="/">Return to the catalog</Link>
    </section>
  );
}

export default NotFoundPage;
