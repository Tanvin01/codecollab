"use client";
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { CheckCircle, XCircle, MessageCircle } from "lucide-react";

const SUBMIT_REVIEW = gql`
  mutation SubmitReview($reviewId: ID!, $decision: Decision!) {
    submitReview(reviewId: $reviewId, decision: $decision) {
      id status decision
    }
  }
`;

export default function ReviewDecisionBar({ reviewId }: { reviewId: string }) {
  const [submitReview, { loading }] = useMutation(SUBMIT_REVIEW);
  const [submitted, setSubmitted] = useState(false);

  const decide = async (decision: string) => {
    await submitReview({ variables: { reviewId, decision } });
    setSubmitted(true);
  };

  if (submitted) return <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center text-green-400 text-sm">Review submitted</div>;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
      <p className="text-sm text-slate-300 font-medium">Submit your review</p>
      <div className="flex gap-2">
        <button onClick={() => decide("COMMENT")} disabled={loading}
          className="flex items-center gap-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg transition-colors">
          <MessageCircle className="w-3.5 h-3.5" />Comment
        </button>
        <button onClick={() => decide("REQUEST_CHANGES")} disabled={loading}
          className="flex items-center gap-1.5 text-xs bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/30 px-3 py-2 rounded-lg transition-colors">
          <XCircle className="w-3.5 h-3.5" />Request Changes
        </button>
        <button onClick={() => decide("APPROVE")} disabled={loading}
          className="flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg transition-colors">
          <CheckCircle className="w-3.5 h-3.5" />Approve
        </button>
      </div>
    </div>
  );
}
