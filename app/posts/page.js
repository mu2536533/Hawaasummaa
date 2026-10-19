'use client'
import { useState, useEffect } from "react"
import { getCurrentUser } from "@/services/auth"
import { createPost,getAllPosts,deletePost } from "@/services/database"

export default function postPage() {
    const [user,setUser] = useState(null);
    const [posts,setPosts] = useState([]);
    const [newPost,setNewPost] = useState('');
    const [loading,setLoading] = useState(true);
    const [posting,setPosting] = useState(false);
    const [error,setError] = useState('');

    useEffect(() => {
        checkUserAndLoadPosts();
    },  []);
const checkUserAndLoadPosts = async () =>{
    setLoading(true);

    const userResult = await getCurrentUser();
    if (userResult.success) {
        setUser(userResult.user);

        await loadPosts();
    } else {
        setError('please login first');
    }
    setLoading(false);
};
const loadPosts = async () => {
    const result = await getAllPosts();
    if(result.success) {
        setPosts(result.posts)
    }else {
        setError(result.error);
    }
};

const handleCreatePost = async (e) => {
    e.preventDefault();
    if(!newPost.trim() || !user) return;

    setPosting(true);
    setError('');

    const result = await createPost(
        user.id,
        user.email,
        user.name,
        newPost
    );

    if (result.success) {
        setNewPost('');
        await loadPosts();
    } else {
        setError(result.error);
    }
}

}