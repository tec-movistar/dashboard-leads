export const getToken = () : string | any => {
    return typeof window !== 'undefined' && localStorage.getItem('tokenTecMovistarDashboardLeads')
}