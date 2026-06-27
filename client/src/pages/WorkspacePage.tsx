"use client";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import ReviewList from "../components/review/ReviewList";
import { Plus } from "lucide-react";
const GET_WORKSPACE = gql`query GetWorkspace($id:ID!){ workspace(id:$id){ id name description members{ user{ id name } role } } }`;
export default function WorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useQuery(GET_WORKSPACE, { variables: { id } });
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>;
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-2xl font-bold text-white">{data?.workspace?.name}</h1><p className="text-slate-400 text-sm mt-1">{data?.workspace?.description}</p></div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium"><Plus className="w-4 h-4"/>New Review</button>
        </div>
        {id && <ReviewList workspaceId={id}/>}
      </div>
    </div>
  );
}
