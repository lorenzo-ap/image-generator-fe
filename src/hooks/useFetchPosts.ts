import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { postService } from '../services/post';

export const useFetchPosts = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const posts = useSelector((state: RootState) => state.posts.allPosts);

  const fetchPosts = useCallback(() => {
    setLoading(true);

    postService.getPosts().finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (posts.length) return;

    fetchPosts();
  }, [posts.length, fetchPosts]);

  return { fetchPosts, loading };
};
