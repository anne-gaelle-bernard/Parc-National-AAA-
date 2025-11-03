export const campingService = {
    async getCampingDetails(campingId) {
        try {
            const response = await fetch(`/Backend/api/get-camping-details.php?id=${campingId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la récupération des détails du camping.");
            }
            return await response.json();
        } catch (error) {
            console.error("Erreur dans campingService.getCampingDetails:", error);
            throw error;
        }
    }
};
