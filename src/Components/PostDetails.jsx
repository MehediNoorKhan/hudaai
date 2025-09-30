import React, { useState, useContext } from "react";
import { useParams } from "react-router";
import { FaThumbsUp, FaThumbsDown, FaShareAlt, FaComment } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "./AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";

export default function PostDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/posts/${id}`);
      return {
        ...data,
        upVote: data.upVote ?? 0,
        downVote: data.downVote ?? 0,
        comments: data.comments || [],
        upvote_by: data.upvote_by || [],
        downvote_by: data.downvote_by || [],
      };
    },
    refetchOnWindowFocus: false,
  });

  const voteMutation = useMutation({
    mutationFn: async (type) => {
      const { data } = await axiosSecure.post(`/posts/${id}/vote`, { type });
      return data;
    },
    onMutate: async (type) => {
      await queryClient.cancelQueries({ queryKey: ["post", id] });
      const previousPost = queryClient.getQueryData(["post", id]);

      queryClient.setQueryData(["post", id], (old) => {
        if (!old) return old;

        let upVote = old.upVote ?? 0;
        let downVote = old.downVote ?? 0;
        let upvote_by = old.upvote_by ?? [];
        let downvote_by = old.downvote_by ?? [];

        const userEmail = user.email?.toLowerCase();

        if (type === "upvote") {
          if (upvote_by.includes(userEmail)) {
            upVote -= 1;
            upvote_by = upvote_by.filter((email) => email !== userEmail);
          } else {
            upVote += 1;
            upvote_by = [...upvote_by, userEmail];
            if (downvote_by.includes(userEmail)) {
              downVote -= 1;
              downvote_by = downvote_by.filter((email) => email !== userEmail);
            }
          }
        } else if (type === "downvote") {
          if (downvote_by.includes(userEmail)) {
            downVote -= 1;
            downvote_by = downvote_by.filter((email) => email !== userEmail);
          } else {
            downVote += 1;
            downvote_by = [...downvote_by, userEmail];
            if (upvote_by.includes(userEmail)) {
              upVote -= 1;
              upvote_by = upvote_by.filter((email) => email !== userEmail);
            }
          }
        }

        return { ...old, upVote, downVote, upvote_by, downvote_by };
      });

      return { previousPost };
    },
    onError: () => {
      toast.error("Failed to vote");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
  });

  const handleVote = (type) => {
    if (!user) return toast.warning("Please login to vote");
    voteMutation.mutate(type);
  };

  const commentMutation = useMutation({
    mutationFn: async (comment) => {
      const { data } = await axiosSecure.post(`/posts/${id}/comment`, {
        comment,
        postTitle: post.postTitle,
      });
      return data;
    },
    onSuccess: (newCommentData) => {
      queryClient.setQueryData(["post", id], (old) => ({
        ...old,
        comments: [newCommentData, ...(old.comments || [])],
      }));
      setNewComment("");
      toast.success("Comment added!");
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });

  const handleComment = () => {
    if (!user) return toast.warning("Login required");
    if (!newComment.trim()) return toast.warning("Comment cannot be empty");
    commentMutation.mutate(newComment);
  };

  const handleShare = () => {
    if (!post) return;
    const postUrl = encodeURIComponent(`${window.location.origin}/postdetails/${post._id}`);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`,
      "fbShareWindow",
      "height=450,width=550,top=100,left=100,resizable=yes"
    );
  };

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  if (!post) return <p className="text-center mt-6">Post not found</p>;

  const userEmail = user?.email?.toLowerCase();
  const hasUpvoted = post.upvote_by?.includes(userEmail);
  const hasDownvoted = post.downvote_by?.includes(userEmail);

  return (
    <div className="max-w-3xl mx-auto mt-6 mb-6 p-6 bg-gray-100 rounded shadow-md space-y-6">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Author Info */}
      <div className="flex items-center gap-3">
        <img
          src={post.authorImage || "/default-avatar.png"}
          alt={post.authorName || "Unknown"}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{post.authorName || "Unknown"}</p>
          <p className="text-gray-500 text-sm">{new Date(post.creation_time).toLocaleString()}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="flex flex-row justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{post.postTitle}</h2>
          <p className="text-gray-700 mb-3">{post.postDescription}</p>
        </div>
        <div>
          <p className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            #{post.tag}
          </p>
        </div>
      </div>

      {/* Voting & Share */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={() => handleVote("upvote")}
          className={`flex items-center gap-1 ${hasUpvoted ? "text-green-600 font-bold" : "text-gray-600"
            } hover:text-green-600 transition cursor-pointer`}
        >
          <FaThumbsUp /> {post.upVote ?? 0}
        </button>
        <button
          onClick={() => handleVote("downvote")}
          className={`flex items-center gap-1 ${hasDownvoted ? "text-red-600 font-bold" : "text-gray-600"
            } hover:text-red-600 transition cursor-pointer`}
        >
          <FaThumbsDown /> {post.downVote ?? 0}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition cursor-pointer"
        >
          <FaShareAlt /> Share
        </button>
        <div className="flex items-center gap-1 text-gray-500 cursor-pointer">
          <FaComment /> {post.comments?.length ?? 0}
        </div>
      </div>

      {/* Comment Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Comments ({post.comments?.length ?? 0})</h3>

        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
          <AwesomeButton
            type="primary"
            size="medium"
            ripple
            onPress={handleComment}
            disabled={commentMutation.isLoading}
            className="mt-2 cursor-pointer"
          >
            {commentMutation.isLoading ? "Posting..." : "Post Comment"}
          </AwesomeButton>
        </div>

        <div className="mt-6 space-y-4">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((c, i) => (
              <div key={c._id || i} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={c.commenterImage || "/default-avatar.png"}
                    alt={c.commenterName || "Anonymous"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{c.commenterName || "Anonymous"}</p>
                    <p className="text-gray-500 text-xs">{new Date(c.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-gray-700">{c.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaComment className="mx-auto text-4xl mb-2 text-gray-300" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
