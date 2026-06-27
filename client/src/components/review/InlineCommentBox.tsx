"use client";
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Send } from "lucide-react";

const ADD_COMMENT = gql`
  mutation AddComment($reviewId: ID!, $lineNumber: Int!, $filePath: String!, $body: String!) {
    addComment(reviewId: $reviewId, lineNumber: $lineNumber, filePath: $filePath, body: $body) {
      id body lineNumber author { name }
    }
  }
`;

interface Props { reviewId: string; lineNumber: number; filePath: string; onClose: () => void; }

export default function InlineCommentBox({ reviewId, lineNumber, filePath, onClose }: Props) {
  const [body, setBody] = useState("");
  const [addComment, { loading }] = useMutation(ADD_COMMENT, {
    onCompleted: () => { setBody(""); onClose(); },
  });
  return (
    <div className="bg-slate-800 border border-blue-500/30 rounded-xl p-4 my-2">
      <p className="text-xs text-slate-400 mb-2">Comment on line {lineNumber} — <span className="text-slate-500">{filePath}</span></p>
      <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Leave a comment..."
        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none h-20" />
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={onClose} className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg">Cancel</button>
        <button onClick={() => addComment({ variables: { reviewId, lineNumber, filePath, body } })} disabled={!body.trim() || loading}
          className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg">
          <Send className="w-3 h-3" />{loading ? "Posting..." : "Comment"}
        </button>
      </div>
    </div>
  );
}
