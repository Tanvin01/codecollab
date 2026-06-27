"use client";
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { MessageSquare, Check, X } from "lucide-react";
const ADD_COMMENT = gql`mutation AddComment($reviewId:ID!,$lineNumber:Int!,$filePath:String!,$body:String!){addComment(reviewId:$reviewId,lineNumber:$lineNumber,filePath:$filePath,body:$body){id body author{name}createdAt}}`;
const SUBMIT_REVIEW = gql`mutation SubmitReview($reviewId:ID!,$decision:Decision!){submitReview(reviewId:$reviewId,decision:$decision){id status decision}}`;
interface Props { reviewId: string; diff: string; filePaths: string[]; }
export default function DiffViewer({ reviewId, diff, filePaths }: Props) {
  const [activeFile, setActiveFile] = useState(filePaths[0] ?? "");
  const [commentLine, setCommentLine] = useState<number|null>(null);
  const [commentText, setCommentText] = useState("");
  const [addComment] = useMutation(ADD_COMMENT);
  const [submitReview] = useMutation(SUBMIT_REVIEW);
  const lines = diff.split("\n");
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="flex gap-1 px-4 py-3 border-b border-slate-700 overflow-x-auto">
        {filePaths.map(f => <button key={f} onClick={() => setActiveFile(f)}
          className={`px-3 py-1 rounded text-xs font-mono shrink-0 ${activeFile===f ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}>{f.split("/").pop()}</button>)}
      </div>
      <div className="font-mono text-xs overflow-x-auto">
        {lines.map((line, i) => (
          <div key={i} onClick={() => setCommentLine(i)}
            className={`group flex items-start hover:bg-slate-800/60 cursor-pointer ${line.startsWith("+") ? "bg-green-500/5 text-green-300" : line.startsWith("-") ? "bg-red-500/5 text-red-300" : "text-slate-300"}`}>
            <span className="w-12 shrink-0 px-2 py-1 text-slate-600 border-r border-slate-800 select-none">{i+1}</span>
            <span className="px-3 py-1 flex-1">{line}</span>
            <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-blue-400 shrink-0"><MessageSquare className="w-3 h-3" /></button>
          </div>
        ))}
      </div>
      {commentLine !== null && (
        <div className="border-t border-slate-700 p-4">
          <p className="text-xs text-slate-400 mb-2">Comment on line {commentLine+1}</p>
          <textarea value={commentText} onChange={e => setCommentText(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white resize-none h-20 focus:outline-none focus:border-blue-500" placeholder="Write a comment..." />
          <div className="flex gap-2 mt-2">
            <button onClick={() => { addComment({ variables: { reviewId, lineNumber: commentLine+1, filePath: activeFile, body: commentText } }); setCommentLine(null); setCommentText(""); }}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-1.5 rounded-lg">Add Comment</button>
            <button onClick={() => setCommentLine(null)} className="text-slate-400 hover:text-white text-xs px-3 py-1.5">Cancel</button>
          </div>
        </div>
      )}
      <div className="border-t border-slate-700 p-4 flex gap-3">
        <button onClick={() => submitReview({ variables: { reviewId, decision: "APPROVE" } })}
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white text-xs px-4 py-2 rounded-lg"><Check className="w-3.5 h-3.5" />Approve</button>
        <button onClick={() => submitReview({ variables: { reviewId, decision: "REQUEST_CHANGES" } })}
          className="flex items-center gap-1.5 bg-yellow-600 hover:bg-yellow-500 text-white text-xs px-4 py-2 rounded-lg"><X className="w-3.5 h-3.5" />Request Changes</button>
      </div>
    </div>
  );
}
