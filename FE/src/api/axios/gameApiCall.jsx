import gameUrl from "@/api/url/gameUrl";
import useAxiosConfig from "@/hooks/useAxiosConfig";

const gameApiCall = () => {
  const privateAxios = useAxiosConfig().privateAxios;
  const getRanking = async (type) => {
    const getRankingUrl = `${gameUrl.getRanking()}/${type}`;
    try {
      const response = await privateAxios.get(getRankingUrl);
      return response.data;
    } catch (error) {
      alert(error.response?.data?.errorMessage);
    }
  };

  return { getRanking };
};

export default gameApiCall;
