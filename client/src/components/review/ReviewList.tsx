"use client";
import { useQuery, gql } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
const GET_REVIEWS = gql`
  query GetReviews($workspaceId: ID!, $status: ReviewStatus) {
    reviews(workspaceId: $workspaceId, status: $status) {
      id title status decision createdAt
      author { id name }
      comments { id }
    }
  }
`;
export default function ReviewList({ workspaceId }: { workspaceId: string }) {
  const { data, loading } = useQuery(GET_REVIEWS, { variables: { workspaceId } });
  if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />)}</div>;
  const STATUS_COLORS: Record<string, string> = { OPEN: "text-blue-400 bg-blue-500/10", APPROVED: "text-green-400 bg-green-500/10", CHANGES_REQUESTED: "text-yellow-400 bg-yellow-500/10", MERGED: "text-purple-400 bg-purple-500/10" };
  return (
    <div className="space-y-2">
      {data?.reviews.map((r: any) => (
        <Link key={r.id} href={`/review/${r.id}`}>
          <div className="bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-xl p-4 flex items-center justify-between transition-all">
            <div>
              <h3 className="font-medium text-white text-sm">{r.title}</h3>
              <p className="text-slate-500 text-xs mt-0.5">by {r.author.name} · {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })} · {r.comments.length} comments</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[r.status] ?? "bg-slate-700 text-slate-300"}`}>{r.status.replace("_"," ")}</span>
          </div>
        </Link>
      ))}
      {data?.reviews.length === 0 && <p className="text-slate-500 text-center py-8">No reviews yet</p>}
    </div>
  );
}
