import { useState, useEffect, useCallback } from "react";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [topCollaborators, setTopCollaborators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const data = await response.json();
      setUsers(data.users);
      setTopCollaborators(data.topCollaborators);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Activo" ? "Inactivo" : "Activo";
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      fetchUserData(); // Recargamos para ver el cambio
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const createUser = async (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
  }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // opcional si tu API lo requiere
          },
          body: JSON.stringify(userData),
        },
      );

      const data = await response.json();

      // refrescar lista después de crear
      fetchUserData();

      return data;
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return { users, topCollaborators, isLoading, toggleStatus, createUser };
};
