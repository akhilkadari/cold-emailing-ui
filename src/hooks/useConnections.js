import { useState, useEffect } from "react";
import { connectionService } from "../services/connectionService";
import { hasConnectionData } from "../utils/constants";

export const useConnections = (session) => {
  const [connections, setConnections] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState(null);
  const [error, setError] = useState(null);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      loadConnections();
    }
  }, [session]);

  const generateConnections = async (connections) => {
    setGenLoading(true);
    setGenError(null);

    try {
      const data = await connectionService.generateConnections(connections);
      // Transform the response to prospect format
      const prospectsData = Array.isArray(data) ? data : [data];
      const formattedProspects = prospectsData.map((prospect, idx) => ({
        id: `generated-${idx}`,
        firstName: prospect.firstName || prospect.first_name || "",
        lastName: prospect.lastName || prospect.last_name || "",
        profileUrl:
          prospect.profileUrl ||
          prospect.profile_url ||
          prospect.linkedin ||
          "",
        discarded: false,
      }));
      setProspects(formattedProspects);
    } catch (err) {
      setGenError(err.message);
    } finally {
      setGenLoading(false);
    }
  };

  const updateProspect = (index, updatedProspect) => {
    setProspects((prev) =>
      prev.map((prospect, idx) => (idx === index ? updatedProspect : prospect))
    );
  };

  const discardProspect = (index) => {
    setProspects((prev) =>
      prev.map((prospect, idx) =>
        idx === index
          ? { ...prospect, discarded: !prospect.discarded }
          : prospect
      )
    );
  };

  const resetProspects = () => {
    setProspects([]);
    setGenError(null);
  };

  const loadConnections = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await connectionService.loadConnectionsByUserId(
        session.user.id
      );
      if (data && data.length > 0) {
        setConnections(data);
      } else {
        setConnections([]);
      }
    } catch (err) {
      console.error("Error loading connections:", err);
      setError(err.message);
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  const saveConnections = async (updatedConnections = connections) => {
    if (!session?.user?.id) return;

    try {
      const newConnections = updatedConnections.filter(
        (connection) => !connection.id && hasConnectionData(connection)
      );
      const existingConnections = updatedConnections.filter(
        (connection) => connection.id
      );
      if (newConnections.length > 0) {
        await connectionService.insertConnections(
          newConnections,
          session.user.id
        );
      }

      for (const connection of existingConnections) {
        if (connection.id) {
          await connectionService.updateConnection(connection, session.user.id);
        }
      }
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    } catch (err) {
      console.error("Error saving connections:", err);
      setError(err.message);
    }
  };

  const deleteConnection = async (connectionId) => {
    if (!connectionId || !session?.user?.id) return;

    try {
      await connectionService.deleteConnection(connectionId, session.user.id);
    } catch (err) {
      console.error("Error deleting connection:", err);
      setError(err.message);
    }
  };

  const resetConnections = () => {
    setConnections([]);
    setError(null);
    setShowSaved(false);
  };

  return {
    connections,
    setConnections,
    prospects,
    loading,
    error,
    showSaved,
    saveConnections,
    deleteConnection,
    resetConnections,
    genLoading,
    genError,
    generateConnections,
    updateProspect,
    discardProspect,
    resetProspects,
  };
};
