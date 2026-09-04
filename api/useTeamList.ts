import { useQuery } from '@tanstack/react-query';
import { get } from '@truefit/http-utils';
import { ApiError } from '../types/api';
import { Team } from '../models/Team';
import useApiError from './useApiError';

export const TeamListQueryKey = 'team-list';

export const useTeamList = () => {
    const handleApiError = useApiError();
    const { data, isFetching, refetch } = useQuery({
        queryKey: [TeamListQueryKey],
        queryFn: async () => {
            try {
                return await get<Array<Team>>(`teams`);
            } catch (err) {
                await handleApiError(err as ApiError);
                throw err;
            }
        },
    });
    return {
        teams: data?.data,
        isFetching,
        refetch,
    };
};
