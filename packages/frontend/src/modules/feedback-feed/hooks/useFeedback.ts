// modules/feedback-feed/hooks/useFeedback.ts

import { useState, useEffect, useCallback } from "react";
import api from "../../../api/axios";
export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = useCallback(async () => {
    try {
      const response = await api.get("/api/messages");
      setFeedbacks(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  return { feedbacks, loading, fetchFeedbacks }; // <-- Exponemos fetchFeedbacks
};
