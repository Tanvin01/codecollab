"use client";
import { useQuery, gql } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { GitPullRequest, Clock, CheckCircle, XCircle, MessageCircle } from "lucide-react";

const GET_REVIEWS = gql`
  query GetReviews($workspaceId: ID!) {
    reviews(workspaceId: $workspaceId) {
      id title status decision createdAt
      author { id name }
      comments { id }
      reviewers { id name }
    }
  }
`;

const STATUS_ICON = { OPEN: GitPullRequest, APPROVED: CheckCircle, CHANGES_REQUESTED: XCircle, MERGED: GitPullRequest };
const STATUS_COLOR = { OPEN: "text-blue-400", APPROVED: "text-green-400", CHANGES_REQUESTED: "text-red-400", MERGED: "text-purple-400" };

export default function ReviewList({ workspaceId }: { workspaceId: string }) {
  const { data, loading } = useQuery(GET_REVIEWS, { variables: { workspaceId } });
  if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />)}</div>;
  return (
    <div className="space-y-2">
      {data?.reviews.map((r: any) => {
        const Icon = STATUS_ICON[r.status as keyof typeof STATUS_ICON] || GitPullRequest;
        return (
          <Link key={r.id} to={`/review/${r.id}`} className="flex items-center gap-4 bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-xl p-4 transition-all group">
            <Icon className={`w-5 h-5 shrink-0 ${STATUS_COLOR[r.status as keyof typeof STATUS_COLOR] || "text-slate-400"}`} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate group-hover:text-blue-400">{r.title}</p>
              <p className="text-xs text-slate-500">by {r.author.name} · {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}</p>
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs"><MessageCircle className="w-3.5 h-3.5" />{r.comments.length}</div>
          </Link>
        );
      })}
    </div>
  );
}
