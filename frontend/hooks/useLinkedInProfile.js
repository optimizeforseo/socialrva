import { useState, useEffect } from "react";
import linkedinService from "../app/services/linkedinService";

export function useLinkedInProfile() {
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLinkedInData() {
      try {
        setLoading(true);
        setError(null);

        // Get access token from localStorage
        const accessToken = localStorage.getItem("linkedinAccessToken");
        const linkedinUserId = localStorage.getItem("linkedinUserId");

        if (!accessToken) {
          // Use demo data if no access token
          const demoProfile = linkedinService.getDemoProfile();
          const demoAnalytics = linkedinService.getDemoAnalytics();
          setProfile(demoProfile);
          setAnalytics(demoAnalytics);
          setLoading(false);
          return;
        }

        // Fetch real LinkedIn profile
        const profileData = await linkedinService.getProfile(accessToken);
        setProfile(profileData);

        // Fetch analytics if we have userId
        if (linkedinUserId) {
          const analyticsData = await linkedinService.getAnalytics(
            accessToken,
            linkedinUserId
          );
          setAnalytics(analyticsData);
        } else {
          setAnalytics(linkedinService.getDemoAnalytics());
        }
      } catch (err) {
        console.error("Error fetching LinkedIn data:", err);
        setError(err.message);
        // Fallback to demo data on error
        setProfile(linkedinService.getDemoProfile());
        setAnalytics(linkedinService.getDemoAnalytics());
      } finally {
        setLoading(false);
      }
    }

    fetchLinkedInData();
  }, []);

  const refreshProfile = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("linkedinAccessToken");
      const linkedinUserId = localStorage.getItem("linkedinUserId");

      if (accessToken) {
        const profileData = await linkedinService.getProfile(accessToken);
        setProfile(profileData);

        if (linkedinUserId) {
          const analyticsData = await linkedinService.getAnalytics(
            accessToken,
            linkedinUserId
          );
          setAnalytics(analyticsData);
        }
      }
    } catch (err) {
      console.error("Error refreshing LinkedIn data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    analytics,
    loading,
    error,
    refreshProfile,
  };
}
