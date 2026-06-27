"use client";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import InlineCommentBox from "../components/review/InlineCommentBox";
import ReviewDecisionBar from "../components/review/ReviewDecisionBar";
import { useState } from "react";
const GET_REVIEW = gql`query GetReview($id:ID!){ review(id:$id){ id title description diff status decision author{ name } comments{ id body lineNumber filePath author{ name } resolved } } }`;
export default function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useQuery(GET_REVIEW, { variables: { id } });
  const [commentLine, setCommentLine] = useState<number|null>(null);
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading review...</div>;
  const review = data?.review;
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <h1 className="text-xl font-bold text-white mb-1">{review?.title}</h1>
          <p className="text-slate-400 text-sm">by {review?.author?.name} · Status: <span className="text-blue-400">{review?.status}</span></p>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-700 text-sm font-medium text-slate-300">Diff</div>
          <pre className="p-5 text-xs text-slate-300 overflow-x-auto font-mono whitespace-pre">{review?.diff}</pre>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <h2 className="font-semibold text-white mb-3">Comments ({review?.comments?.length ?? 0})</h2>
          {review?.comments?.map((c: any) => (
            <div key={c.id} className={`py-3 border-b border-slate-800 last:border-0 ${c.resolved?"opacity-50":""}`}>
              <p className="text-xs text-slate-500 mb-1">{c.author.name} · Line {c.lineNumber} · {c.filePath}</p>
              <p className="text-slate-300 text-sm">{c.body}</p>
            </div>
          ))}
        </div>
        {id && <ReviewDecisionBar reviewId={id}/>}
      </div>
    </div>
  );
}
