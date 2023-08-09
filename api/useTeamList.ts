
import {useQuery} from '@tanstack/react-query';
import {get} from '@truefit/http-utils';
import Constants from 'expo-constants';
import {ApiError} from '../types/api';
import {Team} from '../models/Team'; 
import useApiError from './useApiError';

export const TeamListQueryKey = 'team-list';

type TeamListReturnType = { 
    data?: Array<Team>;
    isLoading: boolean;
}

export const useTeamList = () => {
    const handleApiError = useApiError();
    const {data, isFetching, refetch} = useQuery(
        [TeamListQueryKey],
        () => get<Array<Team>>(`teams`),
        {
            onError: (err: ApiError) => handleApiError(err),
        },
    );
    return {
        teams: data?.data,
        isFetching,
        refetch,
    };
}

