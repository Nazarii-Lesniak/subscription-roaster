import { ArrowLeft, Flame } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found-card">
        <span className="not-found-icon">
          <Flame size={26} />
        </span>
        <p className="eyebrow">404 · OFF THE MENU</p>
        <h1>This page got cancelled.</h1>
        <p>
          The link you followed doesn’t exist. Your subscriptions are still
          right where you left them.
        </p>
        <Link className="button button-primary" href="/">
          <ArrowLeft size={16} /> Back to the roast
        </Link>
      </div>
    </main>
  );
}
